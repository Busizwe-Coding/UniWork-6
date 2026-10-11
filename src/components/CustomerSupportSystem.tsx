import React, { useState, useRef } from 'react';
import {
    LifeBuoy,
    MessageSquareWarning,
    Camera,
    UploadCloud,
    CheckCircle2,
    Clock,
    AlertTriangle,
    FileText,
    ShieldCheck,
    ChefHat,
    Sparkles,
    Search,
    Filter,
    Send,
    X,
    Plus,
    Eye,
    Gift,
    RotateCcw,
    ArrowRight,
    UserCheck,
    Flame,
    BadgeAlert,
    Paperclip
} from 'lucide-react';
import {
    ComplaintTicket,
    ComplaintCategory,
    ComplaintSeverity,
    ComplaintStatus,
    DesiredResolution,
    Order
} from '../types';
import { sampleProofImages } from '../data/complaintsData';

interface CustomerSupportSystemProps {
    tickets: ComplaintTicket[];
    orders: Order[];
    onAddTicket: (ticket: ComplaintTicket) => void;
    onUpdateTicketStatus: (ticketId: string, status: ComplaintStatus, notes?: string, comp?: string) => void;
    onAddTicketMessage: (ticketId: string, sender: 'customer' | 'support' | 'executive_chef', senderName: string, message: string, roleTitle?: string) => void;
    initialOrderId?: string;
}

export const CustomerSupportSystem: React.FC<CustomerSupportSystemProps> = ({
    tickets,
    orders,
    onAddTicket,
    onUpdateTicketStatus,
    onAddTicketMessage,
    initialOrderId = ''
}) => {
    // Navigation inside support: 'file' | 'tickets' | 'admin'
    const [activeSubTab, setActiveSubTab] = useState<'file' | 'tickets' | 'admin'>('file');

    // Selected ticket for detailed view
    const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
    const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

    // Image Lightbox Modal
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // Search & Filters for ticket list
    const [ticketSearch, setTicketSearch] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // New Complaint Form State
    const [orderId, setOrderId] = useState<string>(initialOrderId || (orders[0]?.id ? orders[0].id : ''));
    const [customerName, setCustomerName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [category, setCategory] = useState<ComplaintCategory>('Food Quality & Freshness');
    const [severity, setSeverity] = useState<ComplaintSeverity>('Medium');
    const [desiredResolution, setDesiredResolution] = useState<DesiredResolution>('Replacement Delivery');
    const [subject, setSubject] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [attachedImages, setAttachedImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitSuccessTicketId, setSubmitSuccessTicketId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    // Customer reply state in ticket tracker
    const [customerReplyText, setCustomerReplyText] = useState<string>('');

    // Manager desk state
    const [managerReplyText, setManagerReplyText] = useState<string>('');
    const [managerRole, setManagerRole] = useState<'support' | 'executive_chef'>('support');
    const [customCompensation, setCustomCompensation] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories: { label: ComplaintCategory; desc: string; icon: string }[] = [
        { label: 'Food Quality & Freshness', desc: 'Temperature, taste, texture, freshness of fish/rice', icon: '🍣' },
        { label: 'Missing / Incorrect Items', desc: 'Missing rolls, incorrect order items, missing condiments', icon: '🔍' },
        { label: 'Late or Cold Delivery', desc: 'Transit delay, courier handling, packaging temperature', icon: '⏱️' },
        { label: 'Damaged Packaging / Spillage', desc: 'Crushed wooden box, leaked sauces, disarranged sushi', icon: '📦' },
        { label: 'Service & Staff Experience', desc: 'Customer service, communication, concierge interaction', icon: '🤝' },
        { label: 'Billing & Pricing Discrepancy', desc: 'Charge errors, coupon issues, receipt clarification', icon: '💳' },
        { label: 'Compliment & Culinary Feedback', desc: 'Chef praise, dish suggestions, seasonal menu feedback', icon: '⭐' }
    ];

    const severityOptions: { level: ComplaintSeverity; color: string; eta: string }[] = [
        { level: 'Low', color: 'border-blue-300 text-blue-800 bg-blue-50', eta: '< 4 hours response' },
        { level: 'Medium', color: 'border-amber-300 text-amber-800 bg-amber-50', eta: '< 1 hour response' },
        { level: 'Urgent', color: 'border-[#bc001f] text-[#bc001f] bg-red-50', eta: '< 15 mins immediate dispatch' }
    ];

    const resolutions: DesiredResolution[] = [
        'Replacement Delivery',
        'Full Refund',
        'Store Credit Voucher',
        'Chef Inspection & Direct Apology',
        'Other'
    ];

    // Handle native file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files: File[] = Array.from(e.target.files);
            files.forEach((file: File) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        setAttachedImages((prev) => [...prev, reader.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files: File[] = Array.from(e.dataTransfer.files);
            files.forEach((file: File) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (reader.result) {
                            setAttachedImages((prev) => [...prev, reader.result as string]);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    };

    const handleAddSampleImage = (url: string) => {
        if (!attachedImages.includes(url)) {
            setAttachedImages((prev) => [...prev, url]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setAttachedImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Submit Complaint Form
    const handleSubmitComplaint = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !description.trim()) return;

        setIsSubmitting(true);

        setTimeout(() => {
            const newTicketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
            const newTicket: ComplaintTicket = {
                id: newTicketId,
                orderId: orderId.trim() ? orderId.trim() : undefined,
                customerName: customerName.trim() || 'Guest Customer',
                email: email.trim(),
                phone: phone.trim(),
                category,
                severity,
                subject,
                description,
                desiredResolution,
                images: attachedImages,
                createdAt: 'Just now',
                status: 'Submitted',
                assignedTo: 'Lead Concierge & Quality Assurance',
                messages: [
                    {
                        id: `msg-${Date.now()}`,
                        sender: 'customer',
                        senderName: customerName.trim() || 'Guest Customer',
                        message: `${description}\n\n[Desired Resolution: ${desiredResolution}]`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                ]
            };

            onAddTicket(newTicket);
            setSelectedTicketId(newTicketId);
            setIsSubmitting(false);
            setSubmitSuccessTicketId(newTicketId);

            // Reset form
            setSubject('');
            setDescription('');
            setAttachedImages([]);
        }, 800);
    };

    // Handle Customer Reply
    const handleSendCustomerReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerReplyText.trim() || !selectedTicket) return;

        onAddTicketMessage(
            selectedTicket.id,
            'customer',
            selectedTicket.customerName,
            customerReplyText.trim()
        );
        setCustomerReplyText('');
    };

    // Handle Staff Manager Reply & Status Update
    const handleSendManagerReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!managerReplyText.trim() || !selectedTicket) return;

        const senderName = managerRole === 'executive_chef' ? 'Chef Takashi Yamamoto' : 'Ayaka M.';
        const roleTitle = managerRole === 'executive_chef' ? 'Executive Sous Chef' : 'Ginza Guest Concierge Lead';

        onAddTicketMessage(
            selectedTicket.id,
            managerRole,
            senderName,
            managerReplyText.trim(),
            roleTitle
        );
        setManagerReplyText('');
    };

    const handleGrantCompensationPreset = (compText: string) => {
        if (!selectedTicket) return;
        onUpdateTicketStatus(selectedTicket.id, 'Compensation Issued', 'Compensation authorized and credited to customer account.', compText);
    };

    // Filtered Tickets
    const filteredTickets = tickets.filter((t) => {
        const matchesSearch =
            t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
            t.customerName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
            t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
            (t.orderId && t.orderId.toLowerCase().includes(ticketSearch.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusBadge = (status: ComplaintStatus) => {
        switch (status) {
            case 'Submitted':
                return <span className="font-mono-caps text-[10px] px-2.5 py-1 bg-blue-100 text-blue-800 font-bold">SUBMITTED</span>;
            case 'Under Review':
                return <span className="font-mono-caps text-[10px] px-2.5 py-1 bg-amber-100 text-amber-800 font-bold">UNDER REVIEW</span>;
            case 'Kitchen Investigating':
                return <span className="font-mono-caps text-[10px] px-2.5 py-1 bg-purple-100 text-purple-800 font-bold flex items-center gap-1"><ChefHat className="w-3 h-3" /> KITCHEN AUDIT</span>;
            case 'Compensation Issued':
                return <span className="font-mono-caps text-[10px] px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1"><Gift className="w-3 h-3" /> COMPENSATED</span>;
            case 'Resolved':
                return <span className="font-mono-caps text-[10px] px-2.5 py-1 bg-gray-100 text-gray-700 font-bold">✓ RESOLVED</span>;
            default:
                return null;
        }
    };

    const getSeverityBadge = (sev: ComplaintSeverity) => {
        switch (sev) {
            case 'Urgent':
                return <span className="font-mono text-[10px] px-2 py-0.5 bg-red-100 text-[#bc001f] border border-red-200 font-bold flex items-center gap-1"><BadgeAlert className="w-3 h-3" /> URGENT</span>;
            case 'High':
                return <span className="font-mono text-[10px] px-2 py-0.5 bg-orange-100 text-orange-800 border border-orange-200 font-bold">HIGH</span>;
            case 'Medium':
                return <span className="font-mono text-[10px] px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200">MEDIUM</span>;
            case 'Low':
                return <span className="font-mono text-[10px] px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200">LOW</span>;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-8">
            {/* Top Banner Header */}
            <div className="bg-[#1a1c1c] text-white p-6 md:p-8 border-l-4 border-[#bc001f] shadow-lg mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-[#bc001f] font-mono-caps text-xs font-bold">
                            <LifeBuoy className="w-4 h-4 text-[#bc001f]" />
                            <span>NURI GUEST CONCIERGE & QUALITY ASSURANCE</span>
                        </div>
                        <h1 className="font-display text-2xl md:text-3xl font-extrabold mt-1 text-white tracking-tight">
                            Customer Feedback & Complaint Management
                        </h1>
                        <p className="font-body text-xs md:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
                            We uphold uncompromising standards for our sushi craft. If your dining experience fell short of perfection, file a structured complaint with photographic evidence for immediate GM review and chef resolution.
                        </p>
                    </div>

                    {/* Guarantee Badges */}
                    <div className="grid grid-cols-2 gap-3 font-mono text-xs text-left">
                        <div className="bg-white/5 border border-white/10 p-3">
                            <span className="text-[#bc001f] font-bold block text-[10px]">100% REPAIR PROMISE</span>
                            <span className="text-white text-xs font-semibold">Immediate Refund / Re-roll</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-3">
                            <span className="text-emerald-400 font-bold block text-[10px]">DIRECT CHEF AUDIT</span>
                            <span className="text-white text-xs font-semibold">&lt; 15m Urgent Response</span>
                        </div>
                    </div>
                </div>

                {/* Sub-tab Navigation */}
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
                    <button
                        onClick={() => {
                            setActiveSubTab('file');
                            setSubmitSuccessTicketId(null);
                        }}
                        className={`font-mono-caps text-xs px-5 py-2.5 transition-all flex items-center gap-2 ${activeSubTab === 'file'
                                ? 'bg-[#bc001f] text-white font-bold shadow-md'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>File a Complaint / Feedback</span>
                    </button>

                    <button
                        onClick={() => setActiveSubTab('tickets')}
                        className={`font-mono-caps text-xs px-5 py-2.5 transition-all flex items-center gap-2 ${activeSubTab === 'tickets'
                                ? 'bg-[#bc001f] text-white font-bold shadow-md'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Track My Tickets ({tickets.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveSubTab('admin')}
                        className={`font-mono-caps text-xs px-5 py-2.5 transition-all flex items-center gap-2 ${activeSubTab === 'admin'
                                ? 'bg-amber-600 text-white font-bold shadow-md'
                                : 'bg-white/10 text-amber-300 hover:bg-white/20'
                            }`}
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Staff Concierge & Chef Desk (Admin)</span>
                    </button>
                </div>
            </div>

            {/* SUB-VIEW 1: FILE COMPLAINT / FEEDBACK FORM */}
            {activeSubTab === 'file' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Form Container (8 Cols) */}
                    <div className="lg:col-span-8 bg-white border border-[#e7bcb9] p-6 md:p-8 shadow-sm">
                        {submitSuccessTicketId ? (
                            <div className="text-center py-12 space-y-5 animate-fade-in">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <CheckCircle2 className="w-9 h-9" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#1a1c1c]">
                                    Complaint Ticket Registered Successfully
                                </h2>
                                <div className="bg-[#f9f9f9] border border-gray-200 max-w-md mx-auto p-4 font-mono text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-[#5f5e5e]">Tracking Code:</span>
                                        <span className="font-bold text-[#bc001f] text-sm">{submitSuccessTicketId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#5f5e5e]">Estimated Review:</span>
                                        <span className="font-bold text-gray-800">&lt; 20 minutes</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#5f5e5e]">Audited By:</span>
                                        <span>Executive Sous Chef & Concierge</span>
                                    </div>
                                </div>
                                <p className="font-body text-xs text-[#5f5e5e] max-w-md mx-auto">
                                    Our Guest Concierge team and Executive Chef have received your case details and photographic evidence. You will receive an SMS and email update once reviewed.
                                </p>
                                <div className="flex justify-center gap-3 pt-4">
                                    <button
                                        onClick={() => {
                                            setSelectedTicketId(submitSuccessTicketId);
                                            setActiveSubTab('tickets');
                                            setSubmitSuccessTicketId(null);
                                        }}
                                        className="bg-[#bc001f] text-white font-mono-caps text-xs px-6 py-3 hover:bg-[#e6192e] transition-colors font-bold flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>View Ticket Status & Responses</span>
                                    </button>
                                    <button
                                        onClick={() => setSubmitSuccessTicketId(null)}
                                        className="bg-[#eeeeee] text-[#1a1c1c] font-mono-caps text-xs px-5 py-3 hover:bg-[#e2e2e2]"
                                    >
                                        File Another Report
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitComplaint} className="space-y-6">
                                <div>
                                    <span className="font-mono-caps text-[11px] text-[#bc001f] font-bold block mb-1">
                                        STEP 1 OF 3 — INCIDENT CLASSIFICATION
                                    </span>
                                    <h2 className="font-display text-xl font-bold text-[#1a1c1c]">
                                        What issue occurred with your Nuri dining experience?
                                    </h2>
                                </div>

                                {/* Category Selection Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {categories.map((cat) => {
                                        const isSelected = category === cat.label;
                                        return (
                                            <button
                                                key={cat.label}
                                                type="button"
                                                onClick={() => setCategory(cat.label)}
                                                className={`text-left p-3 border transition-all flex items-start gap-3 rounded-xs ${isSelected
                                                        ? 'border-[#bc001f] bg-[#bc001f]/5 ring-1 ring-[#bc001f]'
                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                    }`}
                                            >
                                                <span className="text-xl">{cat.icon}</span>
                                                <div>
                                                    <span className={`font-mono-caps text-xs block ${isSelected ? 'font-bold text-[#bc001f]' : 'font-medium text-[#1a1c1c]'}`}>
                                                        {cat.label}
                                                    </span>
                                                    <span className="font-body text-[11px] text-[#5f5e5e] line-clamp-1">
                                                        {cat.desc}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Severity & Order Information */}
                                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-mono-caps text-xs font-bold mb-1.5 text-[#1a1c1c]">
                                            Associated Order ID (Optional)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={orderId}
                                                onChange={(e) => setOrderId(e.target.value)}
                                                placeholder="e.g. MOORI-982103"
                                                className="w-full border border-gray-200 p-2.5 text-xs font-mono focus:border-[#bc001f] focus:outline-none"
                                            />
                                            {orders.length > 0 && (
                                                <select
                                                    onChange={(e) => setOrderId(e.target.value)}
                                                    className="bg-[#f9f9f9] border border-gray-200 text-[11px] font-mono px-2 text-[#5f5e5e]"
                                                >
                                                    <option value="">Recent Orders</option>
                                                    {orders.map((o) => (
                                                        <option key={o.id} value={o.id}>
                                                            #{o.id} ({o.customerName})
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-mono-caps text-xs font-bold mb-1.5 text-[#1a1c1c]">
                                            Severity / Impact Level
                                        </label>
                                        <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                                            {severityOptions.map((opt) => (
                                                <button
                                                    key={opt.level}
                                                    type="button"
                                                    onClick={() => setSeverity(opt.level)}
                                                    className={`p-2 border text-center transition-all ${severity === opt.level
                                                            ? `${opt.color} font-bold ring-1 ring-current`
                                                            : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div>{opt.level}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                    <div>
                                        <label className="block font-mono text-[11px] text-[#5f5e5e] mb-1">Your Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full border border-gray-200 p-2.5 font-body focus:border-[#bc001f] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-mono text-[11px] text-[#5f5e5e] mb-1">Contact Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border border-gray-200 p-2.5 font-body focus:border-[#bc001f] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-mono text-[11px] text-[#5f5e5e] mb-1">Mobile Phone</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full border border-gray-200 p-2.5 font-mono focus:border-[#bc001f] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Desired Resolution */}
                                <div className="pt-4 border-t border-gray-100">
                                    <label className="block font-mono-caps text-xs font-bold mb-2 text-[#1a1c1c]">
                                        STEP 2 — DESIRED RESOLUTION
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {resolutions.map((res) => (
                                            <button
                                                key={res}
                                                type="button"
                                                onClick={() => setDesiredResolution(res)}
                                                className={`font-mono text-xs px-3.5 py-2 border transition-all rounded-xs ${desiredResolution === res
                                                        ? 'bg-[#1a1c1c] text-white border-[#1a1c1c] font-bold'
                                                        : 'bg-[#f9f9f9] text-[#5f5e5e] border-gray-200 hover:border-gray-400'
                                                    }`}
                                            >
                                                {res}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Subject & Description */}
                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div>
                                        <label className="block font-mono-caps text-xs font-bold mb-1 text-[#1a1c1c]">
                                            Brief Summary / Headline
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="e.g. Inverted roll platter with sauce leakage on wooden box lid"
                                            className="w-full border border-gray-200 p-2.5 text-xs font-body focus:border-[#bc001f] focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-mono-caps text-xs font-bold mb-1 text-[#1a1c1c]">
                                            Detailed Description
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Please provide full details (e.g. which rolls were affected, temperature status, courier interaction, or condiment absence)..."
                                            className="w-full border border-gray-200 p-3 text-xs font-body focus:border-[#bc001f] focus:outline-none leading-relaxed"
                                        />
                                    </div>
                                </div>

                                {/* STEP 3: PICTURE & EVIDENCE ATTACHMENT SECTION */}
                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-mono-caps text-[11px] text-[#bc001f] font-bold block">
                                                STEP 3 OF 3 — ATTACH PHOTOGRAPHIC EVIDENCE
                                            </span>
                                            <h3 className="font-display font-bold text-sm text-[#1a1c1c]">
                                                Upload Pictures of Dish, Box, or Receipt Proof
                                            </h3>
                                        </div>
                                        <span className="font-mono text-[11px] text-[#5f5e5e]">
                                            {attachedImages.length} picture{attachedImages.length === 1 ? '' : 's'} attached
                                        </span>
                                    </div>

                                    {/* Drag & Drop Upload Zone */}
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${isDragging
                                                ? 'border-[#bc001f] bg-[#bc001f]/5'
                                                : 'border-gray-300 bg-[#fbfbfb] hover:border-[#bc001f] hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <UploadCloud className="w-8 h-8 text-[#bc001f] mx-auto mb-2" />
                                        <p className="font-mono-caps text-xs font-bold text-[#1a1c1c]">
                                            DRAG & DROP PICTURES HERE OR CLICK TO BROWSE
                                        </p>
                                        <p className="font-body text-[11px] text-[#5f5e5e] mt-1">
                                            Supports JPG, PNG, WEBP, HEIC (High-resolution kitchen inspection audit)
                                        </p>
                                    </div>

                                    {/* Quick Sample Proof Attachments (For instant demo testing) */}
                                    <div className="bg-[#f9f9f9] border border-gray-200 p-3 rounded-xs">
                                        <div className="flex items-center gap-1.5 text-[11px] font-mono-caps font-bold text-[#5f5e5e] mb-2">
                                            <Sparkles className="w-3.5 h-3.5 text-[#bc001f]" />
                                            <span>QUICK-TEST: SELECT SAMPLE PROOF PICTURES</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {sampleProofImages.map((s) => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => handleAddSampleImage(s.url)}
                                                    className="text-left border border-gray-200 bg-white p-2 hover:border-[#bc001f] transition-all flex items-center gap-2 group"
                                                >
                                                    <img
                                                        src={s.url}
                                                        alt={s.name}
                                                        className="w-10 h-10 object-cover rounded-xs shrink-0"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                    <div className="overflow-hidden">
                                                        <span className="font-mono text-[10px] block font-bold text-gray-800 truncate group-hover:text-[#bc001f]">
                                                            {s.name}
                                                        </span>
                                                        <span className="font-body text-[9px] text-[#5f5e5e] truncate block">
                                                            + Add Photo
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Attached Images Thumbnail Preview Gallery */}
                                    {attachedImages.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                            {attachedImages.map((imgUrl, idx) => (
                                                <div key={idx} className="relative group border border-gray-300 bg-white p-1 rounded-xs shadow-xs">
                                                    <img
                                                        src={imgUrl}
                                                        alt={`Attached proof ${idx + 1}`}
                                                        className="w-full h-24 object-cover cursor-pointer"
                                                        onClick={() => setLightboxImage(imgUrl)}
                                                        referrerPolicy="no-referrer"
                                                    />
                                                    <div className="absolute top-2 right-2 flex gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); setLightboxImage(imgUrl); }}
                                                            className="p-1 bg-black/70 text-white rounded-full hover:bg-black"
                                                            title="Zoom Picture"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                                                            className="p-1 bg-[#bc001f] text-white rounded-full hover:bg-[#e6192e]"
                                                            title="Remove Picture"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <span className="block font-mono text-[9px] text-[#5f5e5e] text-center mt-1 truncate">
                                                        Evidence_Photo_{idx + 1}.jpg
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Action Button */}
                                <div className="pt-6 border-t border-[#e7bcb9] flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-mono text-[#5f5e5e]">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                        <span>SSL Encrypted & Direct Chef Dispatch</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-[#bc001f] text-white font-mono-caps text-xs px-8 py-3.5 hover:bg-[#e6192e] transition-all flex items-center gap-2 font-bold shadow-md disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <span>TRANSMITTING TICKET TO GM...</span>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>SUBMIT COMPLAINT & REQUEST RESOLUTION</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Sidebar Guidelines & Policy (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Quick Contact Box */}
                        <div className="bg-[#1a1c1c] text-white p-6 border-l-4 border-amber-500 space-y-3 font-mono text-xs">
                            <span className="text-amber-400 font-bold block font-mono-caps">DIRECT CONCIERGE HOTLINE</span>
                            <p className="font-body text-xs text-gray-300">
                                For immediate live dietary or critical allergy alerts during active delivery:
                            </p>
                            <div className="text-white font-bold text-sm bg-white/10 p-2.5 text-center">
                                +27 77 898 3456 (Priority)
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SUB-VIEW 2: TRACK EXISTING COMPLAINT TICKETS */}
            {activeSubTab === 'tickets' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Ticket List (5 Cols) */}
                    <div className="lg:col-span-5 bg-white border border-[#e7bcb9] p-5 space-y-4 shadow-sm flex flex-col max-h-[750px]">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <h2 className="font-display text-lg font-bold text-[#1a1c1c]">
                                Support Tickets ({filteredTickets.length})
                            </h2>
                            <span className="font-mono text-xs text-[#bc001f] font-bold">
                                {tickets.filter((t) => t.status !== 'Resolved').length} Active
                            </span>
                        </div>

                        {/* Search & Status Filters */}
                        <div className="space-y-2">
                            <div className="flex items-center bg-[#f9f9f9] border border-gray-200 px-3 py-1.5">
                                <Search className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    value={ticketSearch}
                                    onChange={(e) => setTicketSearch(e.target.value)}
                                    placeholder="Search by ticket #, order #, or keyword..."
                                    className="bg-transparent border-none focus:outline-none text-xs w-full text-[#1a1c1c]"
                                />
                            </div>

                            <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-mono">
                                {['all', 'Submitted', 'Kitchen Investigating', 'Compensation Issued', 'Resolved'].map((st) => (
                                    <button
                                        key={st}
                                        onClick={() => setStatusFilter(st)}
                                        className={`px-2.5 py-1 whitespace-nowrap border transition-all ${statusFilter === st
                                                ? 'bg-[#bc001f] text-white border-[#bc001f] font-bold'
                                                : 'bg-[#f9f9f9] text-[#5f5e5e] border-gray-200 hover:bg-gray-100'
                                            }`}
                                    >
                                        {st === 'all' ? 'All Statuses' : st}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ticket Cards Scrollable List */}
                        <div className="overflow-y-auto space-y-3 flex-1 pr-1 divide-y divide-gray-100">
                            {filteredTickets.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 font-mono text-xs">
                                    No complaint tickets found matching filter.
                                </div>
                            ) : (
                                filteredTickets.map((t) => {
                                    const isSelected = selectedTicket?.id === t.id;
                                    return (
                                        <div
                                            key={t.id}
                                            onClick={() => setSelectedTicketId(t.id)}
                                            className={`pt-3 pb-3 px-3 cursor-pointer transition-all border-l-3 ${isSelected
                                                    ? 'bg-[#bc001f]/5 border-l-[#bc001f] shadow-xs'
                                                    : 'border-l-transparent hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-mono-caps text-xs font-bold text-[#bc001f]">
                                                    {t.id}
                                                </span>
                                                {getStatusBadge(t.status)}
                                            </div>

                                            <h4 className="font-display font-bold text-xs text-[#1a1c1c] line-clamp-1">
                                                {t.subject}
                                            </h4>

                                            <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-[#5f5e5e]">
                                                <span>{t.createdAt}</span>
                                                {t.orderId && <span>• #{t.orderId}</span>}
                                                {t.images.length > 0 && (
                                                    <span className="flex items-center gap-0.5 text-blue-700 bg-blue-50 px-1 rounded-xs">
                                                        <Camera className="w-2.5 h-2.5" /> {t.images.length}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right: Selected Ticket Detail & Messages (7 Cols) */}
                    <div className="lg:col-span-7 bg-white border border-[#e7bcb9] p-6 shadow-sm flex flex-col justify-between max-h-[750px] overflow-y-auto">
                        {selectedTicket ? (
                            <div className="space-y-6">
                                {/* Detail Header */}
                                <div className="pb-4 border-b border-gray-200">
                                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono-caps text-sm font-bold text-[#bc001f]">
                                                    {selectedTicket.id}
                                                </span>
                                                {getSeverityBadge(selectedTicket.severity)}
                                                {getStatusBadge(selectedTicket.status)}
                                            </div>
                                            <h2 className="font-display text-xl font-bold text-[#1a1c1c] mt-1">
                                                {selectedTicket.subject}
                                            </h2>
                                        </div>

                                        {selectedTicket.orderId && (
                                            <div className="bg-[#f9f9f9] border border-gray-200 px-3 py-1.5 text-right font-mono text-xs">
                                                <span className="text-[#5f5e5e] text-[10px] block">ASSOCIATED ORDER</span>
                                                <span className="font-bold text-[#1a1c1c]">#{selectedTicket.orderId}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Metadata Row */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-[#5f5e5e] mt-3 pt-3 border-t border-gray-100">
                                        <div>
                                            <span className="text-gray-400 block text-[9px]">CATEGORY</span>
                                            <span className="font-bold text-gray-800">{selectedTicket.category}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block text-[9px]">CUSTOMER</span>
                                            <span className="font-bold text-gray-800">{selectedTicket.customerName}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block text-[9px]">DESIRED RESOLUTION</span>
                                            <span className="font-bold text-[#bc001f]">{selectedTicket.desiredResolution}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Timeline Stepper */}
                                <div className="bg-[#f9f9f9] border border-gray-200 p-4">
                                    <span className="font-mono-caps text-[10px] font-bold text-[#5f5e5e] block mb-3">
                                        AUDIT PROGRESSION
                                    </span>
                                    <div className="flex items-center justify-between text-center font-mono text-[10px]">
                                        {[
                                            { key: 'Submitted', label: '1. Logged' },
                                            { key: 'Under Review', label: '2. GM Review' },
                                            { key: 'Kitchen Investigating', label: '3. Chef Audit' },
                                            { key: 'Compensation Issued', label: '4. Resolution' },
                                            { key: 'Resolved', label: '5. Closed' }
                                        ].map((step, idx) => {
                                            const allStatuses: ComplaintStatus[] = ['Submitted', 'Under Review', 'Kitchen Investigating', 'Compensation Issued', 'Resolved'];
                                            const currentIdx = allStatuses.indexOf(selectedTicket.status);
                                            const isComplete = idx <= currentIdx;
                                            const isCurrent = idx === currentIdx;

                                            return (
                                                <div key={step.key} className="flex-1 flex flex-col items-center">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${isComplete ? 'bg-[#bc001f] text-white' : 'bg-gray-200 text-gray-400'
                                                        } ${isCurrent ? 'ring-2 ring-[#bc001f]/30' : ''}`}>
                                                        {idx + 1}
                                                    </div>
                                                    <span className={`${isComplete ? 'font-bold text-[#1a1c1c]' : 'text-gray-400'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Compensation Granted Highlight (if issued) */}
                                {selectedTicket.compensationGranted && (
                                    <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-xs text-xs font-mono">
                                        <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                                            <Gift className="w-4 h-4" />
                                            <span>COMPENSATION & VOUCHER GRANTED</span>
                                        </div>
                                        <p className="text-emerald-900 font-bold text-sm">
                                            {selectedTicket.compensationGranted}
                                        </p>
                                        {selectedTicket.resolutionNotes && (
                                            <p className="text-emerald-700 text-[11px] mt-1 font-body">
                                                Resolution Note: "{selectedTicket.resolutionNotes}"
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Attached Photographic Evidence Gallery */}
                                {selectedTicket.images.length > 0 && (
                                    <div>
                                        <h4 className="font-mono-caps text-xs font-bold text-[#1a1c1c] mb-2 flex items-center gap-1.5">
                                            <Camera className="w-3.5 h-3.5 text-[#bc001f]" />
                                            <span>ATTACHED EVIDENCE PHOTOS ({selectedTicket.images.length})</span>
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {selectedTicket.images.map((imgUrl, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => setLightboxImage(imgUrl)}
                                                    className="cursor-pointer group relative border border-gray-300 rounded-xs overflow-hidden bg-black"
                                                >
                                                    <img
                                                        src={imgUrl}
                                                        alt="Evidence thumbnail"
                                                        className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono">
                                                        <Eye className="w-4 h-4 mr-1" /> Enlarge
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Message Conversation Stream */}
                                <div>
                                    <h4 className="font-mono-caps text-xs font-bold text-[#1a1c1c] mb-3">
                                        AUDIT TIMELINE & STAFF MESSAGES
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedTicket.messages.map((msg) => {
                                            const isStaff = msg.sender === 'support' || msg.sender === 'executive_chef';
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`p-3.5 rounded-xs border text-xs leading-relaxed ${msg.sender === 'executive_chef'
                                                            ? 'bg-amber-50/70 border-amber-300 text-[#1a1c1c]'
                                                            : isStaff
                                                                ? 'bg-[#bc001f]/5 border-[#bc001f]/30 text-[#1a1c1c]'
                                                                : 'bg-gray-50 border-gray-200 text-gray-800'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center mb-1.5 font-mono text-[11px]">
                                                        <div className="flex items-center gap-1.5">
                                                            {msg.sender === 'executive_chef' && <ChefHat className="w-3.5 h-3.5 text-amber-700" />}
                                                            {msg.sender === 'support' && <UserCheck className="w-3.5 h-3.5 text-[#bc001f]" />}
                                                            <strong className={isStaff ? 'text-[#bc001f]' : 'text-gray-900'}>
                                                                {msg.senderName}
                                                            </strong>
                                                            {msg.roleTitle && (
                                                                <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 border border-gray-200 rounded-xs">
                                                                    {msg.roleTitle}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-gray-400 text-[10px]">{msg.timestamp}</span>
                                                    </div>
                                                    <p className="font-body whitespace-pre-line text-xs">{msg.message}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Customer Reply Input */}
                                <form onSubmit={handleSendCustomerReply} className="pt-4 border-t border-gray-200">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={customerReplyText}
                                            onChange={(e) => setCustomerReplyText(e.target.value)}
                                            placeholder="Add customer reply or response to concierge..."
                                            className="flex-1 border border-gray-200 p-2.5 text-xs font-body focus:border-[#bc001f] focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-[#1a1c1c] text-white font-mono-caps text-xs px-5 py-2.5 hover:bg-[#bc001f] transition-colors flex items-center gap-1.5"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            <span>Reply</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-400 font-mono text-xs">
                                Select a ticket on the left to inspect evidence and responses.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SUB-VIEW 3: STAFF CONCIERGE & CHEF DESK (ADMIN VIEW) */}
            {activeSubTab === 'admin' && (
                <div className="space-y-6">
                    {/* Admin Banner */}
                    <div className="bg-amber-950 text-amber-100 p-5 border-l-4 border-amber-500 flex justify-between items-center">
                        <div>
                            <span className="font-mono-caps text-xs text-amber-400 font-bold">MANAGEMENT PORTAL</span>
                            <h2 className="font-display text-xl font-bold text-white">
                                Guest Relations & Kitchen Audit Console
                            </h2>
                            <p className="text-xs text-amber-200/80 font-body mt-0.5">
                                Investigate guest complaints, review attached damage proofs, issue instant refunds/credits, and log kitchen feedback.
                            </p>
                        </div>
                        <span className="font-mono text-xs bg-amber-900 px-3 py-1.5 border border-amber-700">
                            Active Mode: General Manager & Sous Chef
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Ticket Selector Table (5 cols) */}
                        <div className="lg:col-span-5 bg-white border border-[#e7bcb9] p-5 space-y-3">
                            <h3 className="font-mono-caps text-xs font-bold text-[#1a1c1c] pb-2 border-b border-gray-100">
                                PENDING CASE QUEUE
                            </h3>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {tickets.map((t) => (
                                    <div
                                        key={t.id}
                                        onClick={() => setSelectedTicketId(t.id)}
                                        className={`p-3 border transition-all cursor-pointer ${selectedTicket?.id === t.id
                                                ? 'border-amber-600 bg-amber-50/50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-mono-caps text-xs font-bold text-[#bc001f]">{t.id}</span>
                                            {getStatusBadge(t.status)}
                                        </div>
                                        <div className="font-bold text-xs text-[#1a1c1c] truncate">{t.customerName} — {t.subject}</div>
                                        <div className="flex justify-between items-center text-[10px] font-mono text-[#5f5e5e] mt-1">
                                            <span>{t.category}</span>
                                            <span className="font-bold text-[#bc001f]">{t.desiredResolution}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Case Action Workbench (7 cols) */}
                        <div className="lg:col-span-7 bg-white border border-[#e7bcb9] p-6 space-y-6 shadow-sm">
                            {selectedTicket ? (
                                <>
                                    <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                                        <div>
                                            <span className="font-mono-caps text-xs text-amber-800 font-bold">CASE AUDIT WORKBENCH</span>
                                            <h3 className="font-display text-lg font-bold text-[#1a1c1c]">
                                                {selectedTicket.id}: {selectedTicket.subject}
                                            </h3>
                                            <p className="font-body text-xs text-[#5f5e5e] mt-1">
                                                Customer: <strong>{selectedTicket.customerName}</strong> ({selectedTicket.email} / {selectedTicket.phone})
                                            </p>
                                        </div>
                                        {getStatusBadge(selectedTicket.status)}
                                    </div>

                                    {/* Status Controller */}
                                    <div>
                                        <label className="block font-mono-caps text-xs font-bold text-[#1a1c1c] mb-2">
                                            1. UPDATE TICKET STATUS
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                                            {[
                                                { status: 'Submitted', label: 'Reset to Submitted' },
                                                { status: 'Under Review', label: 'Mark Under Review' },
                                                { status: 'Kitchen Investigating', label: 'Escalate to Chef' },
                                                { status: 'Compensation Issued', label: 'Issue Compensation' },
                                                { status: 'Resolved', label: 'Mark Fully Resolved' }
                                            ].map((item) => (
                                                <button
                                                    key={item.status}
                                                    type="button"
                                                    onClick={() => onUpdateTicketStatus(selectedTicket.id, item.status as ComplaintStatus)}
                                                    className={`p-2 border transition-all text-center ${selectedTicket.status === item.status
                                                            ? 'bg-[#1a1c1c] text-white font-bold border-[#1a1c1c]'
                                                            : 'bg-[#f9f9f9] text-[#5f5e5e] border-gray-200 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Instant Compensation Presets */}
                                    <div className="bg-[#f9f9f9] border border-gray-200 p-4 space-y-3">
                                        <label className="block font-mono-caps text-xs font-bold text-[#bc001f]">
                                            2. ISSUE IMMEDIATE GUEST COMPENSATION
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                'R150 Instant Dining Credit Voucher',
                                                'R250 Full Roll Replacement Credit',
                                                '100% Full Refund to Credit Card',
                                                'Priority Ginza Express Courier Re-dispatch'
                                            ].map((preset) => (
                                                <button
                                                    key={preset}
                                                    type="button"
                                                    onClick={() => handleGrantCompensationPreset(preset)}
                                                    className="bg-white border border-emerald-600 text-emerald-800 font-mono text-[11px] px-3 py-1.5 hover:bg-emerald-50 transition-colors font-semibold"
                                                >
                                                    + Grant {preset}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Send Official Staff / Chef Reply */}
                                    <form onSubmit={handleSendManagerReply} className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="font-mono-caps text-xs font-bold text-[#1a1c1c]">
                                                3. SEND OFFICIAL CONCIERGE / CHEF RESPONSE
                                            </label>
                                            <div className="flex items-center gap-3 font-mono text-xs">
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="role"
                                                        checked={managerRole === 'support'}
                                                        onChange={() => setManagerRole('support')}
                                                        className="accent-[#bc001f]"
                                                    />
                                                    <span>Guest Concierge</span>
                                                </label>
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="role"
                                                        checked={managerRole === 'executive_chef'}
                                                        onChange={() => setManagerRole('executive_chef')}
                                                        className="accent-[#bc001f]"
                                                    />
                                                    <span>Executive Sous Chef</span>
                                                </label>
                                            </div>
                                        </div>

                                        <textarea
                                            rows={3}
                                            required
                                            value={managerReplyText}
                                            onChange={(e) => setManagerReplyText(e.target.value)}
                                            placeholder="Type response to guest (will be logged to ticket audit trail)..."
                                            className="w-full border border-gray-200 p-2.5 text-xs font-body focus:border-[#bc001f] focus:outline-none"
                                        />

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-[#bc001f] text-white font-mono-caps text-xs px-6 py-2.5 hover:bg-[#e6192e] transition-colors flex items-center gap-2 font-bold"
                                            >
                                                <Send className="w-3.5 h-3.5" />
                                                <span>Dispatch Response to Guest</span>
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-20 text-gray-400 font-mono text-xs">
                                    Select a pending case to review and authorize compensation.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox Modal for Zooming Pictures */}
            {lightboxImage && (
                <div
                    onClick={() => setLightboxImage(null)}
                    className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
                >
                    <div className="relative max-w-4xl w-full bg-[#1a1c1c] border border-gray-700 p-2 rounded-xs overflow-hidden">
                        <button
                            onClick={() => setLightboxImage(null)}
                            className="absolute top-4 right-4 p-2 bg-black/70 text-white rounded-full hover:bg-[#bc001f] transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-2 flex flex-col items-center">
                            <img
                                src={lightboxImage}
                                alt="High resolution evidence proof"
                                className="max-h-[75vh] w-auto object-contain rounded-xs"
                                referrerPolicy="no-referrer"
                            />
                            <div className="w-full text-center mt-3 text-gray-300 font-mono text-xs">
                                <span>Photographic Evidence Proof • Inspected by Nuri Quality Assurance</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
