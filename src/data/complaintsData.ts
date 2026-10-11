import { ComplaintTicket } from '../types';

export const sampleProofImages = [
    {
        id: 'proof-1',
        name: 'Spilled Soy & Wasabi in Box',
        category: 'Damaged Packaging',
        url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'proof-2',
        name: 'Missing Truffle Garnish on Wagyu Nigiri',
        category: 'Missing Items',
        url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'proof-3',
        name: 'Melted Temperature Issue on Otoro Sashimi',
        category: 'Food Quality',
        url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'proof-4',
        name: 'Wrong Roll Received (Spicy Salmon instead of Red Dragon)',
        category: 'Incorrect Items',
        url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
    }
];

export const initialComplaints: ComplaintTicket[] = [
    {
        id: 'TKT-8492',
        orderId: 'MOORI-982103',
        customerName: 'Kenji Sato',
        email: 'kenji@ginza-tokyo.jp',
        phone: '+81 90-1234-5678',
        category: 'Damaged Packaging / Spillage',
        severity: 'High',
        subject: 'Red Dragon rolls inverted and sauce leaked onto wooden box',
        description: 'During courier transit on 4-2-1 Ginza route, the temperature seal was loose and the artisanal unagi glaze spilled into the ginger compartment. The rolls were partially disarranged.',
        desiredResolution: 'Replacement Delivery',
        images: [
            'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80'
        ],
        createdAt: 'Today, 10:45 AM',
        status: 'Kitchen Investigating',
        assignedTo: 'Sous Chef Yamamoto & Dispatch Team',
        messages: [
            {
                id: 'msg-1',
                sender: 'customer',
                senderName: 'Kenji Sato',
                message: 'Hello, I received order MOORI-982103 ten minutes ago. The packaging seal was damaged during delivery and the roll shifted significantly.',
                timestamp: '10:45 AM'
            },
            {
                id: 'msg-2',
                sender: 'support',
                senderName: 'Ayaka M.',
                roleTitle: 'Ginza Guest Concierge',
                message: 'Dear Sato-san, we sincerely apologize for this courier transit mishandling. I have escalated this directly to our Executive Sous Chef Yamamoto and assigned our priority Ginza courier.',
                timestamp: '10:50 AM'
            },
            {
                id: 'msg-3',
                sender: 'executive_chef',
                senderName: 'Chef Takashi Yamamoto',
                roleTitle: 'Executive Sous Chef',
                message: 'We inspected the station log. A fresh Red Dragon platter with reinforced wooden bento partitions is being freshly torched right now for expedited re-dispatch.',
                timestamp: '10:54 AM'
            }
        ]
    },
    {
        id: 'TKT-7319',
        orderId: 'MOORI-849201',
        customerName: 'Elena Rostova',
        email: 'elena.rostova@tokyo-intl.org',
        phone: '+81 80-9988-7766',
        category: 'Missing / Incorrect Items',
        severity: 'Medium',
        subject: 'House Fresh Shiso Infused Wasabi missing from Omakase box',
        description: 'We ordered the Tsukiji Sashimi selection with extra fresh grated wasabi root, but only pickled ginger was in the condiment tray.',
        desiredResolution: 'Store Credit Voucher',
        images: [
            'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80'
        ],
        createdAt: 'Yesterday, 6:30 PM',
        status: 'Compensation Issued',
        compensationGranted: 'R150.00 Instant Dining Credit + 20% Voucher (Code: NURI-CARE-20)',
        resolutionNotes: 'Customer satisfied with instant R150 credit voucher credited to mobile profile.',
        assignedTo: 'Lead Concierge Ayaka',
        messages: [
            {
                id: 'msg-10',
                sender: 'customer',
                senderName: 'Elena Rostova',
                message: 'Hi team, everything was delicious, but our extra fresh wasabi was omitted from the sashimi box.',
                timestamp: 'Yesterday, 6:30 PM'
            },
            {
                id: 'msg-11',
                sender: 'support',
                senderName: 'Ayaka M.',
                roleTitle: 'Ginza Guest Concierge',
                message: 'We deeply regret the omission, Elena. We have issued a R150 immediate credit voucher to your profile and added a VIP gift voucher (NURI-CARE-20) for your next order.',
                timestamp: 'Yesterday, 6:42 PM'
            }
        ]
    },
    {
        id: 'TKT-6012',
        orderId: 'MOORI-771920',
        customerName: 'Marcus Vance',
        email: 'marcus.vance@techcorp.io',
        phone: '+81 70-3344-5566',
        category: 'Compliment & Culinary Feedback',
        severity: 'Low',
        subject: 'Commendation for Truffle Wagyu Nigiri & Temperature Box',
        description: 'Just wanted to send praise to the kitchen. The warm rice and cool fatty tuna temperature control was Michelin-grade perfection. Delivery arrived in 18 minutes.',
        desiredResolution: 'Chef Inspection & Direct Apology',
        images: [
            'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80'
        ],
        createdAt: 'Aug 29, 2026',
        status: 'Resolved',
        resolutionNotes: 'Passed to Head Chef Jiro and kitchen team during daily debrief.',
        assignedTo: 'Executive Chef Jiro Ono',
        messages: [
            {
                id: 'msg-20',
                sender: 'customer',
                senderName: 'Marcus Vance',
                message: 'Incredible experience tonight. The A5 wagyu nigiri was transcendent. Keep up the high standard!',
                timestamp: 'Aug 29, 8:15 PM'
            },
            {
                id: 'msg-21',
                sender: 'executive_chef',
                senderName: 'Chef Takashi Yamamoto',
                roleTitle: 'Executive Sous Chef',
                message: 'Domo arigato gozaimasu, Marcus-san! The brigade is honored. We look forward to crafting your next omakase course.',
                timestamp: 'Aug 29, 8:30 PM'
            }
        ]
    }
];
