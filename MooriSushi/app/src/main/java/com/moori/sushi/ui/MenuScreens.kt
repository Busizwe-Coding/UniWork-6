@file:OptIn(ExperimentalMaterial3Api::class)

package com.moori.sushi.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.moori.sushi.data.CartOptions
import com.moori.sushi.data.SushiItem
import java.util.Locale

@Composable
fun HomeScreen(vm: AppViewModel, onSelect: (SushiItem) -> Unit) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize(),
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary),
                shape = RoundedCornerShape(16.dp),
            ) {
                Column(Modifier.padding(20.dp)) {
                    Text(
                        "Modern Japanese minimalist",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onPrimary,
                    )
                    Text(
                        "Fresh sushi, delivered with care.",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onPrimary,
                        modifier = Modifier.padding(top = 4.dp, bottom = 12.dp),
                    )
                    Button(
                        onClick = { vm.navigate(Screen.Menu) },
                        colors = androidx.compose.material3.ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.surface,
                            contentColor = MaterialTheme.colorScheme.primary,
                        ),
                    ) { Text("ORDER NOW", fontWeight = FontWeight.Bold) }
                }
            }
        }
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            ) {
                Column(Modifier.padding(16.dp)) {
                    SectionTitle("Limited time")
                    Text(
                        "20% off your first order",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                    )
                    Text(
                        "Use promo code $PROMO_CODE in your cart. Free delivery on orders over R500.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                    )
                }
            }
        }
        if (vm.seasonal.isNotEmpty()) {
            item { SectionTitle("Seasonal creations") }
            item {
                LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(vm.seasonal, key = { it.id }) { item -> SeasonalCard(item) { onSelect(item) } }
                }
            }
        }
        item {
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                SectionTitle("Full menu", Modifier.weight(1f))
                TextButton(onClick = { vm.navigate(Screen.Menu) }) { Text("See all") }
            }
        }
        items(vm.allItems.take(4), key = { it.id }) { item -> SushiRow(item) { onSelect(item) } }
        if (vm.allItems.isEmpty()) {
            item { Text("The menu isn't available right now. Pull up the Menu tab to try again.", color = MaterialTheme.colorScheme.onSurfaceVariant) }
        }
    }
}

@Composable
private fun SeasonalCard(item: SushiItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier.width(220.dp).clickable(onClick = onClick),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        SushiImage(item.image, Modifier.fillMaxWidth().height(140.dp))
        Column(Modifier.padding(12.dp)) {
            Text(item.name, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Text(
                money(item.price),
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold,
            )
        }
    }
}

@Composable
private fun SushiRow(item: SushiItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().clickable(onClick = onClick),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Row(Modifier.padding(12.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            SushiImage(item.image, Modifier.size(88.dp).clip(RoundedCornerShape(8.dp)))
            Column(Modifier.weight(1f)) {
                Text(item.name, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text(
                    item.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        money(item.price),
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.weight(1f),
                    )
                    if (item.spicy) Text("Spicy", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.primary)
                }
            }
        }
    }
}

@Composable
fun MenuScreen(vm: AppViewModel, onSelect: (SushiItem) -> Unit) {
    var query by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("all") }
    val menuItems = vm.allItems
    val categories = listOf("all") + menuItems.map { it.category }.distinct()
    val shown = menuItems.filter {
        (category == "all" || it.category == category) &&
            (query.isBlank() || it.name.contains(query, ignoreCase = true) || it.description.contains(query, ignoreCase = true))
    }

    Column(Modifier.fillMaxSize()) {
        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            placeholder = { Text("Search sushi...") },
            leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
            singleLine = true,
            modifier = Modifier.fillMaxWidth().padding(start = 16.dp, end = 16.dp, top = 12.dp),
        )
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            items(categories) { c ->
                FilterChip(
                    selected = category == c,
                    onClick = { category = c },
                    label = { Text(c.replaceFirstChar { ch -> ch.titlecase(Locale.getDefault()) }) },
                )
            }
        }
        if (menuItems.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize(),
            ) {
                items(shown, key = { it.id }) { item -> SushiRow(item) { onSelect(item) } }
                if (shown.isEmpty()) {
                    item { Text("No sushi found.", color = MaterialTheme.colorScheme.onSurfaceVariant) }
                }
            }
        }
    }
}

@Composable
fun ItemSheet(item: SushiItem, onDismiss: () -> Unit, onAdd: (Int, CartOptions) -> Unit) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var quantity by remember { mutableIntStateOf(1) }
    var spiciness by remember { mutableStateOf("Mild") }
    var wasabi by remember { mutableStateOf(false) }
    var ginger by remember { mutableStateOf(false) }
    var rice by remember { mutableStateOf("Traditional White") }
    var notes by remember { mutableStateOf("") }

    ModalBottomSheet(onDismissRequest = onDismiss, sheetState = sheetState) {
        Column(
            Modifier
                .verticalScroll(rememberScrollState())
                .navigationBarsPadding()
                .padding(horizontal = 16.dp, vertical = 8.dp),
        ) {
            SushiImage(item.image, Modifier.fillMaxWidth().height(200.dp).clip(RoundedCornerShape(12.dp)))
            Spacer(Modifier.height(12.dp))
            Text(item.name, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.ExtraBold)
            item.japaneseName?.let {
                Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Text(
                item.description,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(top = 8.dp),
            )
            item.pieces?.let {
                Text(it, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }

            Spacer(Modifier.height(16.dp))
            SectionTitle("Spiciness")
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("Mild", "Medium", "Signature Hot").forEach { level ->
                    FilterChip(selected = spiciness == level, onClick = { spiciness = level }, label = { Text(level) })
                }
            }
            Spacer(Modifier.height(8.dp))
            SectionTitle("Rice")
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("Traditional White", "Organic Brown").forEach { r ->
                    FilterChip(selected = rice == r, onClick = { rice = r }, label = { Text(r) })
                }
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Extra wasabi", Modifier.weight(1f))
                Switch(checked = wasabi, onCheckedChange = { wasabi = it })
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Extra ginger", Modifier.weight(1f))
                Switch(checked = ginger, onCheckedChange = { ginger = it })
            }
            OutlinedTextField(
                value = notes,
                onValueChange = { notes = it },
                label = { Text("Notes for the chef (optional)") },
                modifier = Modifier.fillMaxWidth(),
            )

            Spacer(Modifier.height(12.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                QtyStepper(quantity) { quantity = maxOf(1, minOf(20, it)) }
                Spacer(Modifier.width(8.dp))
                Button(
                    onClick = { onAdd(quantity, CartOptions(spiciness, wasabi, ginger, rice, notes.trim())) },
                    modifier = Modifier.weight(1f).height(50.dp),
                ) {
                    Text("ADD TO CART — ${money(item.price * quantity)}", fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}
