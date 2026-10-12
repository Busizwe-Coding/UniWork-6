package com.moori.sushi

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.moori.sushi.ui.AppViewModel
import com.moori.sushi.ui.MooriApp
import com.moori.sushi.ui.MooriTheme

class MainActivity : ComponentActivity() {
    private val viewModel: AppViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MooriTheme(viewModel.themeMode) {
                MooriApp(viewModel)
            }
        }
    }
}
