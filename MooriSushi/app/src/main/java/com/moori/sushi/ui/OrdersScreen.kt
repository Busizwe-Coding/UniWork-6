package com.moori.sushi.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.moori.sushi.data.ORDER_FLOW
import com.moori.sushi.data.Order
import com.moori.sushi.data.STAGE_LABELS
import kotlinx.coroutines.delay
import java.util.Locale

private val stageIcons: Map<String, ImageVector> = mapOf(
    "Received" to Icons.Filled.Schedule,
    "Kitchen" to Icons.Filled.Restaurant,
    "Seared" to Icons.Filled.LocalFireDepartment,
    "Delivery" to Icons.Filled.LocalShipping,
    "Delivered" to Icons.Filled.CheckCircle,
)

@Composable
fun OrdersScreen(vm: AppViewModel) {
    if (vm.orders.isEmpty()) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
                Text("No active orders yet", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text(
                    "Place an order and you can track it here.",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(vertical = 8.dp),
                )
                LogoutButton(vm)
            }
        }
        return
    }

    val order = vm.orders.firstOrNull { it.id == vm.selectedOrderId } ?: vm.orders.first()

    var now by remember { mutableLongStateOf(System.currentTimeMillis()) }
    LaunchedEffect(Unit) {
        while (true) {
            delay(1000)
            now = System.currentTimeMillis()
        }
    }

    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        if (vm.orders.size > 1) {
            SectionTitle("Your orders")
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(vm.orders, key = { it.id }) { o ->
                    FilterChip(
                        selected = o.id == order.id,
                        onClick = { vm.selectedOrderId = o.id },
                        label = { Text("#${o.id} • ${o.status}") },
                    )
                }
            }
        }

        Text("Order #${order.id}", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.ExtraBold)

        Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)) {
            Column(Modifier.padding(16.dp)) {
                SectionTitle("Estimated arrival")
                val remaining = if (order.createdAtMs > 0) {
                    maxOf(0L, (order.createdAtMs + order.estimatedMinutes * 60_000L - now) / 1000)
                } else {
                    order.estimatedMinutes * 60L
                }
                Text(
                    if (order.status == "Delivered") "ARRIVED!" else String.format(Locale.US, "%d:%02d", remaining / 60, remaining % 60),
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.primary,
                )
                Text(
                    "Delivering to: ${order.deliveryAddress}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }

        SectionTitle("Preparation timeline")
        Timeline(order)

        SectionTitle("Ordered items")
        Card(
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        ) {
            Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                order.items.forEach { line ->
                    Row(Modifier.fillMaxWidth()) {
                        Column(Modifier.weight(1f)) {
                            Text("${line.quantity}x ${line.item.name}", fontWeight = FontWeight.Bold)
                            Text(
                                "${line.options.riceType} • ${line.options.spiciness}",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        Text(money(line.item.price * line.quantity), color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            Text("TOTAL PAID", Modifier.weight(1f), style = MaterialTheme.typography.labelLarge)
            Text(money(order.total), fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
        }

        LogoutButton(vm)
    }
}

@Composable
private fun Timeline(order: Order) {
    val current = ORDER_FLOW.indexOf(order.status).coerceAtLeast(0)
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        LinearProgressIndicator(
            progress = { current / (ORDER_FLOW.size - 1).toFloat() },
            modifier = Modifier.fillMaxWidth().height(6.dp).clip(CircleShape),
        )
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            ORDER_FLOW.forEachIndexed { index, stage ->
                val done = index <= current
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.weight(1f)) {
                    Box(
                        Modifier
                            .size(34.dp)
                            .clip(CircleShape)
                            .background(if (done) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(
                            stageIcons.getValue(stage),
                            contentDescription = null,
                            tint = if (done) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(18.dp),
                        )
                    }
                    Text(
                        STAGE_LABELS.getValue(stage),
                        style = MaterialTheme.typography.labelSmall,
                        textAlign = TextAlign.Center,
                        fontWeight = if (index == current) FontWeight.Bold else FontWeight.Normal,
                        modifier = Modifier.padding(top = 4.dp),
                    )
                }
            }
        }
    }
}

@Composable
fun LogoutButton(vm: AppViewModel) {
    OutlinedButton(
        onClick = { vm.logout() },
        modifier = Modifier.fillMaxWidth().height(48.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary),
    ) {
        Icon(Icons.AutoMirrored.Filled.ExitToApp, contentDescription = null, modifier = Modifier.size(18.dp))
        Spacer(Modifier.size(8.dp))
        Text("LOGOUT", fontWeight = FontWeight.Bold)
    }
}
