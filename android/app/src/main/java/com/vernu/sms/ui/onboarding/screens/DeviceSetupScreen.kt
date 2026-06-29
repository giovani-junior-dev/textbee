package com.vernu.sms.ui.onboarding.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.vernu.sms.ui.onboarding.OnboardingViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DeviceSetupScreen(
    viewModel: OnboardingViewModel,
    onSuccess: () -> Unit,
    onBack: () -> Unit
) {
    val state by viewModel.state.collectAsState()
    val context = LocalContext.current

    LaunchedEffect(Unit) {
        viewModel.registrationSuccess.collect { onSuccess() }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = {},
                    navigationIcon = {
                        IconButton(onClick = onBack) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Voltar")
                        }
                    }
                )
            }
        ) { padding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(horizontal = 24.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                Spacer(modifier = Modifier.height(8.dp))

                StepIndicator(current = 2, total = 3)

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = if (state.isReturningUser) "Reconecte seu aparelho" else "Configure seu aparelho",
                    style = MaterialTheme.typography.headlineMedium
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = if (state.isReturningUser)
                        "Insira o ID do aparelho para reconectá-lo à sua conta"
                    else
                        "Dê um nome a este aparelho e registre-o para começar a enviar SMS",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(24.dp))

                if (state.isReturningUser) {
                    OutlinedTextField(
                        value = state.deviceId,
                        onValueChange = { viewModel.setDeviceId(it) },
                        label = { Text("ID do aparelho") },
                        placeholder = { Text("Insira o ID do aparelho") },
                        supportingText = { Text("Encontre em sms.wablastmessage.com/dashboard → Aparelhos") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                } else {
                    var expandDeviceId by remember { mutableStateOf(false) }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Checkbox(
                            checked = expandDeviceId,
                            onCheckedChange = {
                                expandDeviceId = it
                                viewModel.setUseExistingDeviceId(it)
                            }
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Este aparelho já foi registrado antes",
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                    Text(
                        text = "Use isto se você reinstalou o app e quer reconectar seu aparelho existente em vez de criar um novo no painel",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(start = 48.dp)
                    )

                    if (expandDeviceId) {
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = state.deviceId,
                            onValueChange = { viewModel.setDeviceId(it) },
                            label = { Text("ID do aparelho") },
                            placeholder = { Text("Insira o ID do aparelho") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                }

                OutlinedTextField(
                    value = state.deviceName,
                    onValueChange = { viewModel.setDeviceName(it) },
                    label = { Text("Nome do aparelho (opcional)") },
                    placeholder = { Text("ex.: Meu celular gateway") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                state.errorMessage?.let { error ->
                    Spacer(modifier = Modifier.height(16.dp))
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.errorContainer
                        ),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = error,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onErrorContainer,
                                modifier = Modifier.weight(1f)
                            )
                            IconButton(onClick = { viewModel.clearError() }, modifier = Modifier.size(20.dp)) {
                                Icon(
                                    Icons.Default.Close,
                                    contentDescription = "Dispensar",
                                    tint = MaterialTheme.colorScheme.onErrorContainer,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(32.dp))

                Button(
                    onClick = { viewModel.registerOrUpdateDevice(context) },
                    enabled = !state.isLoading,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                ) {
                    Text(if (state.isReturningUser) "Reconectar aparelho" else "Registrar aparelho")
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }

        if (state.isLoading) {
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = MaterialTheme.colorScheme.background.copy(alpha = 0.7f)
            ) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Conectando seu aparelho…",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                }
            }
        }
    }
}
