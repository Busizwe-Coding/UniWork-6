package com.moori.sushi.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.moori.sushi.data.ORDER_FLOW
import com.moori.sushi.data.Order

private val nextActionLabel = mapOf(
    "Received" to "START ROLLING",
    "Kitchen" to "TORCH SEARED",
    "Seared" to "SEND TO DELIVERY",
    "Delivery" to "MARK DELIVERED",
)

/** Kitchen Display System: only shown to the admin. Shows every customer's order. */
@Composable
fun KitchenScreen(vm: AppViewModel) {
    var filter by remember { mutableStateOf("all") }
    val shown = vm.orders.filter { filter == "all" || it.status == filter }
    val pending = vm.orders.count { it.status == "Received" || it.status == "Kitchen" }
    val revenue = vm.orders.sumOf { it.total }

    Column(Modifier.fillMaxSize()) {
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary),
            modifier = Modifier.fillMaxWidth().padding(16.dp),
        ) {
            Row(Modifier.padding(16.dp), horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                Column {
                    Text("PENDING PREP", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onPrimary)
                    Text("$pending orders", fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onPrimary)
                }
                Column {
                    Text("REVENUE", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onPrimary)
                    Text(money(revenue), fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onPrimary)
                }
            }
        }

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            items(listOf("all") + ORDER_FLOW) { st ->
                FilterChip(selected = filter == st, onClick = { filter = st }, label = { Text(st.uppercase()) })
            }
        }

        if (shown.isEmpty()) {
            Text(
                "No orders here yet. New customer orders appear automatically.",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(16.dp),
            )
        }

        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize(),
        ) {
            items(shown, key = { it.id }) { order -> KitchenCard(order) { vm.advanceOrder(order) } }
        }
    }
}

@Composable
private fun KitchenCard(order: Order, onAdvance: () -> Unit) {
    Card(
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(Modifier.fillMaxWidth()) {
                Text("#${order.id}", fontWeight = FontWeight.ExtraBold, modifier = Modifier.weight(1f))
                StatusBadge(order.status)
            }
            Text(
                "${order.customerName} • ${order.createdAt}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(
                "${order.phone} • ${order.deliveryAddress}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            order.items.forEach { line ->
                Text("${line.quantity}x ${line.item.name}  (${line.options.spiciness}, ${line.options.riceType})")
                if (line.options.notes.isNotBlank()) {
                    Text(
                        "Note: ${line.options.notes}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
            }
            Text(money(order.total), fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            nextActionLabel[order.status]?.let { label ->
                Button(onClick = onAdvance, modifier = Modifier.fillMaxWidth()) {
                    Text(label, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
