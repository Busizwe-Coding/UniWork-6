package com.moori.sushi.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp

@Composable
fun LoginScreen(vm: AppViewModel) {
    val context = LocalContext.current
    var register by rememberSaveable { mutableStateOf(false) }
    var name by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var number by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    var showPassword by rememberSaveable { mutableStateOf(false) }
    val scheme = MaterialTheme.colorScheme

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(scheme.background)
            .systemBarsPadding()
            .imePadding()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            "Moori Sushi",
            style = MaterialTheme.typography.displaySmall,
            fontWeight = FontWeight.ExtraBold,
            color = scheme.primary,
        )
        Text(
            if (register) "CREATE YOUR ACCOUNT" else "SIGN IN TO CONTINUE",
            style = MaterialTheme.typography.labelMedium,
            color = scheme.onSurfaceVariant,
            modifier = Modifier.padding(top = 4.dp, bottom = 20.dp),
        )

        vm.serverError?.let { message ->
            ErrorText(message, Modifier.fillMaxWidth())
            TextButton(onClick = { vm.retry() }) { Text("Retry connection") }
        }

        TabRow(selectedTabIndex = if (register) 1 else 0, containerColor = scheme.background) {
            Tab(
                selected = !register,
                onClick = { register = false; vm.clearAuthError() },
                text = { Text("Sign in") },
            )
            Tab(
                selected = register,
                onClick = { register = true; vm.clearAuthError() },
                text = { Text("Create account") },
            )
        }
        Spacer(Modifier.height(16.dp))

        if (register) {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Full name") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(
                value = number,
                onValueChange = { number = it },
                label = { Text("Phone number") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(Modifier.height(12.dp))
        }
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth(),
        )
        Spacer(Modifier.height(12.dp))
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text(if (register) "Password (min. 8 characters)" else "Password") },
            singleLine = true,
            visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            trailingIcon = {
                TextButton(onClick = { showPassword = !showPassword }) { Text(if (showPassword) "Hide" else "Show") }
            },
            modifier = Modifier.fillMaxWidth(),
        )

        vm.authError?.let {
            ErrorText(it, Modifier.fillMaxWidth().padding(top = 8.dp))
        }

        Spacer(Modifier.height(16.dp))
        Button(
            onClick = {
                if (register) vm.register(name, email, number, password) else vm.login(email, password)
            },
            enabled = !vm.authBusy,
            modifier = Modifier.fillMaxWidth().height(50.dp),
        ) {
            if (vm.authBusy) {
                CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp, color = scheme.onPrimary)
            } else {
                Text(if (register) "CREATE ACCOUNT" else "SIGN IN", fontWeight = FontWeight.Bold)
            }
        }

        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp),
        ) {
            HorizontalDivider(Modifier.weight(1f))
            Text("  OR  ", style = MaterialTheme.typography.labelSmall, color = scheme.onSurfaceVariant)
            HorizontalDivider(Modifier.weight(1f))
        }

        OutlinedButton(
            onClick = { vm.signInWithGoogle(context) },
            enabled = vm.googleClientId != null && !vm.authBusy,
            modifier = Modifier.fillMaxWidth().height(50.dp),
        ) {
            Text(if (vm.googleClientId == null) "Continue with Google (not configured)" else "Continue with Google")
        }
    }
}
