@file:OptIn(ExperimentalMaterial3Api::class)

package com.moori.sushi.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Kitchen
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import com.moori.sushi.data.SushiItem

@Composable
fun MooriApp(vm: AppViewModel) {
    when {
        vm.booting -> Box(
            Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.Center,
        ) { CircularProgressIndicator() }

        // Login is always the first screen
        vm.user == null -> LoginScreen(vm)

        else -> MainScaffold(vm)
    }
}

private data class NavEntry(val screen: Screen, val label: String, val icon: ImageVector)

@Composable
private fun MainScaffold(vm: AppViewModel) {
    var sheetItem by remember { mutableStateOf<SushiItem?>(null) }
    val isAdmin = vm.user?.isAdmin == true

    BackHandler(enabled = vm.screen == Screen.Checkout) { vm.navigate(Screen.Cart) }
    BackHandler(enabled = vm.screen == Screen.Cart) { vm.navigate(Screen.Home) }

    // The Kitchen KDS tab only exists for the admin
    val tabs = buildList {
        add(NavEntry(Screen.Home, "Home", Icons.Filled.Home))
        add(NavEntry(Screen.Menu, "Menu", Icons.Filled.Restaurant))
        add(NavEntry(Screen.Orders, "Orders", Icons.Filled.Receipt))
        if (isAdmin) add(NavEntry(Screen.Kitchen, "Kitchen", Icons.Filled.Kitchen))
        add(NavEntry(Screen.Settings, "Settings", Icons.Filled.Settings))
    }

    val title = when (vm.screen) {
        Screen.Home -> "Moori Sushi"
        Screen.Menu -> "Menu"
        Screen.Cart -> "Your cart"
        Screen.Checkout -> "Secure checkout"
        Screen.Orders -> "Order tracker"
        Screen.Kitchen -> "Kitchen KDS"
        Screen.Settings -> "Settings"
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(title, fontWeight = FontWeight.ExtraBold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background,
                    titleContentColor = MaterialTheme.colorScheme.primary,
                    actionIconContentColor = MaterialTheme.colorScheme.onBackground,
                ),
                actions = {
                    if (vm.screen != Screen.Checkout) {
                        IconButton(onClick = { vm.navigate(Screen.Cart) }) {
                            BadgedBox(badge = { if (vm.cartCount > 0) Badge { Text(vm.cartCount.toString()) } }) {
                                Icon(Icons.Filled.ShoppingCart, contentDescription = "Cart")
                            }
                        }
                    }
                },
            )
        },
        bottomBar = {
            NavigationBar {
                tabs.forEach { entry ->
                    NavigationBarItem(
                        selected = vm.screen == entry.screen,
                        onClick = { vm.navigate(entry.screen) },
                        icon = { Icon(entry.icon, contentDescription = entry.label) },
                        label = { Text(entry.label) },
                    )
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background,
    ) { padding ->
        Box(Modifier.padding(padding).fillMaxSize()) {
            when (vm.screen) {
                Screen.Home -> HomeScreen(vm) { sheetItem = it }
                Screen.Menu -> MenuScreen(vm) { sheetItem = it }
                Screen.Cart -> CartScreen(vm)
                Screen.Checkout -> CheckoutScreen(vm)
                Screen.Orders -> OrdersScreen(vm)
                Screen.Kitchen -> if (isAdmin) KitchenScreen(vm)
                Screen.Settings -> SettingsScreen(vm)
            }
        }
    }

    sheetItem?.let { item ->
        ItemSheet(
            item = item,
            onDismiss = { sheetItem = null },
            onAdd = { quantity, options ->
                vm.addToCart(item, quantity, options)
                sheetItem = null
            },
        )
    }
}
