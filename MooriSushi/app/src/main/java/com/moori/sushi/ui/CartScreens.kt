package com.moori.sushi.ui

import androidx.compose.foundation.BorderStroke
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.unit.dp

@Composable
fun CartScreen(vm: AppViewModel) {
    if (vm.cart.isEmpty()) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
                Text("Your cart is empty", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text(
                    "Add something delicious from the menu.",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(vertical = 8.dp),
                )
                Button(onClick = { vm.navigate(Screen.Menu) }) { Text("BROWSE MENU") }
            }
        }
        return
    }

    var promo by rememberSaveable { mutableStateOf("") }

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize(),
    ) {
        items(vm.cart, key = { it.cartItemId }) { line ->
            Card(
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            ) {
                Row(Modifier.padding(12.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    SushiImage(line.item.image, Modifier.size(72.dp).clip(RoundedCornerShape(8.dp)))
                    Column(Modifier.weight(1f)) {
                        Text(line.item.name, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                        Text(
                            buildString {
                                append(line.options.riceType).append(" • ").append(line.options.spiciness)
                                if (line.options.extraWasabi) append(" • +wasabi")
                                if (line.options.extraGinger) append(" • +ginger")
                            },
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            QtyStepper(line.quantity) { vm.updateQuantity(line.cartItemId, it) }
                            Text(
                                money(line.item.price * line.quantity),
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.weight(1f),
                            )
                            IconButton(onClick = { vm.updateQuantity(line.cartItemId, 0) }) {
                                Icon(Icons.Filled.Delete, contentDescription = "Remove")
                            }
                        }
                    }
                }
            }
        }

        item {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = promo,
                    onValueChange = { promo = it },
                    label = { Text("Promo code") },
                    singleLine = true,
                    modifier = Modifier.weight(1f),
                )
                OutlinedButton(onClick = { vm.applyPromo(promo) }) { Text("APPLY") }
            }
            if (vm.promoApplied) {
                Text("$PROMO_CODE applied: 20% off", color = MaterialTheme.colorScheme.tertiary, style = MaterialTheme.typography.bodySmall)
            }
            vm.promoError?.let { ErrorText(it) }
        }

        item {
            Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    TotalsRows(vm.subtotal, vm.discount, vm.deliveryFee, vm.total)
                }
            }
        }
        item {
            Button(
                onClick = { vm.navigate(Screen.Checkout) },
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) { Text("PROCEED TO CHECKOUT", fontWeight = FontWeight.Bold) }
        }
    }
}

@Composable
fun TotalsRows(subtotal: Double, discount: Double, deliveryFee: Double, total: Double) {
    Row(Modifier.fillMaxWidth()) {
        Text("Items subtotal", Modifier.weight(1f), color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(money(subtotal))
    }
    if (discount > 0) {
        Row(Modifier.fillMaxWidth()) {
            Text("Discount", Modifier.weight(1f), color = MaterialTheme.colorScheme.primary)
            Text("-" + money(discount), color = MaterialTheme.colorScheme.primary)
        }
    }
    Row(Modifier.fillMaxWidth()) {
        Text("Delivery fee", Modifier.weight(1f), color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(if (deliveryFee == 0.0) "FREE" else money(deliveryFee))
    }
    HorizontalDivider()
    Row(Modifier.fillMaxWidth()) {
        Text("TOTAL", Modifier.weight(1f), fontWeight = FontWeight.Bold)
        Text(money(total), fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
    }
}

@Composable
fun CheckoutScreen(vm: AppViewModel) {
    var name by rememberSaveable { mutableStateOf(vm.user?.name ?: "") }
    var phone by rememberSaveable { mutableStateOf(vm.user?.number ?: "") }
    var address by rememberSaveable { mutableStateOf("") }
    var payment by rememberSaveable { mutableStateOf("card") }
    val methods = listOf("card" to "Credit card", "applepay" to "Mobile wallet", "cash" to "Cash on delivery")

    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        SectionTitle("1. Contact & delivery")
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Full name") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("Phone number") },
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = address,
            onValueChange = { address = it },
            label = { Text("Delivery address") },
            modifier = Modifier.fillMaxWidth(),
        )

        SectionTitle("2. Payment")
        methods.forEach { (id, label) ->
            Row(
                Modifier
                    .fillMaxWidth()
                    .selectable(selected = payment == id, onClick = { payment = id }, role = Role.RadioButton),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                RadioButton(selected = payment == id, onClick = null)
                Text(label, Modifier.padding(start = 8.dp))
            }
        }

        Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                TotalsRows(vm.subtotal, vm.discount, vm.deliveryFee, vm.total)
            }
        }

        vm.checkoutError?.let { ErrorText(it) }

        Button(
            onClick = { vm.placeOrder(name, phone, address, payment) },
            enabled = !vm.checkoutBusy && vm.cart.isNotEmpty(),
            modifier = Modifier.fillMaxWidth().height(52.dp),
        ) {
            if (vm.checkoutBusy) {
                CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp, color = MaterialTheme.colorScheme.onPrimary)
            } else {
                Text("CONFIRM ORDER — ${money(vm.total)}", fontWeight = FontWeight.Bold)
            }
        }
        Spacer(Modifier.height(8.dp))
    }
}
