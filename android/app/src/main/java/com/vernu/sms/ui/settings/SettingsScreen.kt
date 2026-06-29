package com.vernu.sms.ui.settings

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.vernu.sms.BuildConfig

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onSwitchToLegacy: () -> Unit,
    onNavigateToFilters: () -> Unit,
    onDisconnect: () -> Unit,
    viewModel: SettingsViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()
    val context = LocalContext.current
    val clipboard = LocalClipboardManager.current
    val snackbarHostState = remember { SnackbarHostState() }

    var showDisconnectDialog by remember { mutableStateOf(false) }
    var showLegacyDialog by remember { mutableStateOf(false) }
    var showAboutDialog by remember { mutableStateOf(false) }
    var showDeviceNameDialog by remember { mutableStateOf(false) }
    var editedDeviceName by remember(state.deviceName) { mutableStateOf(state.deviceName) }
    var showDelayDialog by remember { mutableStateOf(false) }
    var editedDelay by remember(state.smsSendDelaySeconds) { mutableStateOf(state.smsSendDelaySeconds.toString()) }

    LaunchedEffect(state.snackbarMessage) {
        state.snackbarMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearSnackbar()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Settings, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Configurações", fontWeight = FontWeight.SemiBold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
        ) {
            SettingsSectionHeader("Conta")

            SettingsRow(
                icon = Icons.Default.Fingerprint,
                title = "ID do aparelho",
                subtitle = state.deviceId.ifEmpty { "—" },
                subtitleFont = FontFamily.Monospace,
                trailing = {
                    IconButton(onClick = { clipboard.setText(AnnotatedString(state.deviceId)) }) {
                        Icon(Icons.Default.ContentCopy, contentDescription = "Copiar", modifier = Modifier.size(18.dp))
                    }
                }
            )

            SettingsRow(
                icon = Icons.Default.Key,
                title = "Chave de API",
                subtitle = if (state.apiKey.isEmpty()) "—" else "••••••••" + state.apiKey.takeLast(4),
                trailing = {
                    IconButton(onClick = { clipboard.setText(AnnotatedString(state.apiKey)) }) {
                        Icon(Icons.Default.ContentCopy, contentDescription = "Copiar", modifier = Modifier.size(18.dp))
                    }
                }
            )

            SettingsRow(
                icon = Icons.Default.Edit,
                title = "Nome do aparelho",
                subtitle = state.deviceName,
                onClick = {
                    editedDeviceName = state.deviceName
                    showDeviceNameDialog = true
                },
                trailing = {
                    if (state.isSavingDeviceName) {
                        CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                    } else {
                        Icon(Icons.Default.ChevronRight, contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            )

            Divider(modifier = Modifier.padding(start = 56.dp))

            SettingsRow(
                icon = Icons.Default.LinkOff,
                title = "Desconectar aparelho",
                titleColor = MaterialTheme.colorScheme.error,
                onClick = { showDisconnectDialog = true }
            )

            SettingsSectionHeader("Gateway")

            SettingsSwitchRow(
                icon = Icons.Default.Power,
                title = "Gateway ativado",
                subtitle = "Permitir envio e recebimento de SMS",
                checked = state.isGatewayEnabled,
                onCheckedChange = { viewModel.setGatewayEnabled(it) }
            )

            if (state.availableSims.size > 1) {
                SimSelectionRow(
                    sims = state.availableSims,
                    selectedId = state.preferredSimSubscriptionId,
                    onSelect = { viewModel.setPreferredSim(it) }
                )
                Text(
                    text = "Use o campo simSubscriptionId nas requisições da API para sobrescrever esta configuração",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(start = 56.dp, end = 16.dp, bottom = 8.dp)
                )
            }

            SettingsSectionHeader("SMS")

            SettingsSwitchRow(
                icon = Icons.Default.MoveToInbox,
                title = "Receber SMS",
                subtitle = "Encaminhar SMS recebidos para o backend",
                checked = state.isReceiveSmsEnabled,
                onCheckedChange = { viewModel.setReceiveSms(it) }
            )

            SettingsRow(
                icon = Icons.Default.Timer,
                title = "Atraso de envio",
                subtitle = "${state.smsSendDelaySeconds}s entre cada SMS",
                onClick = {
                    editedDelay = state.smsSendDelaySeconds.toString()
                    showDelayDialog = true
                },
                trailing = {
                    Icon(Icons.Default.ChevronRight, contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            )

            SettingsRow(
                icon = Icons.Default.FilterList,
                title = "Configurar filtros",
                subtitle = "Allow/block list for incoming SMS",
                onClick = onNavigateToFilters,
                trailing = {
                    Icon(Icons.Default.ChevronRight, contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            )

            SettingsSectionHeader("Sistema")

            SettingsSwitchRow(
                icon = Icons.Default.NotificationsActive,
                title = "Notificação fixa",
                subtitle = "Mantém o gateway ativo em segundo plano",
                checked = state.isStickyNotificationEnabled,
                onCheckedChange = { viewModel.setStickyNotification(it) }
            )

            SettingsRow(
                icon = Icons.Default.Info,
                title = "Versão do app",
                subtitle = "${state.appVersionName} (Build ${state.appVersionCode})"
            )

            SettingsRow(
                icon = Icons.Default.AutoAwesome,
                title = "Sobre",
                subtitle = "Wablast SMS",
                onClick = { showAboutDialog = true },
                trailing = {
                    Icon(Icons.Default.ChevronRight, contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            )

            SettingsRow(
                icon = Icons.Default.SystemUpdate,
                title = "Verificar atualizações",
                onClick = {
                    val versionInfo = "${BuildConfig.VERSION_NAME}(${BuildConfig.VERSION_CODE})"
                    val url = "https://textbee.dev/download?currentVersion=${Uri.encode(versionInfo)}"
                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                },
                trailing = {
                    Icon(Icons.Default.OpenInBrowser, contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                }
            )

            SettingsSectionHeader("Comunidade")

            SettingsRow(
                icon = Icons.Default.SupportAgent,
                title = "Suporte",
                onClick = {
                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://app.textbee.dev/dashboard/account/get-support")))
                },
                trailing = {
                    Icon(Icons.Default.OpenInBrowser, contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                }
            )

            SettingsRow(
                icon = Icons.Default.Share,
                title = "Compartilhar Wablast SMS",
                subtitle = "Ajude a divulgar",
                onClick = {
                    val shareText = "venho usando o Wablast SMS para enviar SMS via API do meu próprio celular, " +
                        "sem Twilio ou serviços pagos. ótimo para automações, alertas, " +
                        "notificações, ou qualquer coisa que precise de SMS programático. open source e grátis para começar\n\n" +
                        "https://textbee.dev"
                    context.startActivity(
                        Intent.createChooser(
                            Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_TEXT, shareText)
                            },
                            "Compartilhar Wablast SMS"
                        )
                    )
                }
            )

            SettingsSectionHeader("Jurídico")

            SettingsRow(
                icon = Icons.Default.Gavel,
                title = "Termos de serviço",
                onClick = {
                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://textbee.dev/terms-of-service")))
                },
                trailing = {
                    Icon(Icons.Default.OpenInBrowser, contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                }
            )

            SettingsRow(
                icon = Icons.Default.Policy,
                title = "Política de privacidade",
                onClick = {
                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://textbee.dev/privacy-policy")))
                },
                trailing = {
                    Icon(Icons.Default.OpenInBrowser, contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                }
            )

            SettingsSectionHeader("UI")

            SettingsRow(
                icon = Icons.Default.SwapHoriz,
                title = "Mudar para interface antiga",
                subtitle = "Usar a interface original",
                onClick = { showLegacyDialog = true },
                trailing = {
                    Icon(Icons.Default.ChevronRight, contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            )

            Spacer(modifier = Modifier.height(32.dp))
        }
    }

    if (showDeviceNameDialog) {
        AlertDialog(
            onDismissRequest = { showDeviceNameDialog = false },
            title = { Text("Editar nome do aparelho") },
            text = {
                OutlinedTextField(
                    value = editedDeviceName,
                    onValueChange = { editedDeviceName = it },
                    label = { Text("Nome do aparelho") },
                    singleLine = true
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    viewModel.saveDeviceName(editedDeviceName)
                    showDeviceNameDialog = false
                }) { Text("Salvar") }
            },
            dismissButton = {
                TextButton(onClick = { showDeviceNameDialog = false }) { Text("Cancelar") }
            }
        )
    }

    if (showDelayDialog) {
        AlertDialog(
            onDismissRequest = { showDelayDialog = false },
            title = { Text("Atraso no envio de SMS") },
            text = {
                Column {
                    Text(
                        "Atraso entre cada SMS em segundos (0–3600)",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = editedDelay,
                        onValueChange = { editedDelay = it.filter { c -> c.isDigit() } },
                        label = { Text("Segundos") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    viewModel.setSmsSendDelay(editedDelay.toIntOrNull() ?: 5)
                    showDelayDialog = false
                }) { Text("Salvar") }
            },
            dismissButton = {
                TextButton(onClick = { showDelayDialog = false }) { Text("Cancelar") }
            }
        )
    }

    if (showLegacyDialog) {
        AlertDialog(
            onDismissRequest = { showLegacyDialog = false },
            title = { Text("Mudar para interface antiga?") },
            text = { Text("Você pode voltar pela tela de configurações antiga quando quiser.") },
            confirmButton = {
                TextButton(onClick = {
                    showLegacyDialog = false
                    onSwitchToLegacy()
                }) { Text("Mudar") }
            },
            dismissButton = {
                TextButton(onClick = { showLegacyDialog = false }) { Text("Cancelar") }
            }
        )
    }

    if (showAboutDialog) {
        AlertDialog(
            onDismissRequest = { showAboutDialog = false },
            title = {
                Text("Wablast SMS", fontWeight = FontWeight.Bold)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        "Um gateway de SMS open-source que transforma seu Android em uma API de SMS pessoal. " +
                        "Envie e receba mensagens programaticamente sem depender de serviços terceiros caros.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(
                            onClick = {
                                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://textbee.dev")))
                            }
                        ) {
                            Text("Wablast SMS")
                        }
                        OutlinedButton(
                            onClick = {
                                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://github.com/vernu/textbee")))
                            }
                        ) {
                            Text("GitHub")
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showAboutDialog = false }) { Text("Fechar") }
            }
        )
    }

    if (showDisconnectDialog) {
        AlertDialog(
            onDismissRequest = { showDisconnectDialog = false },
            title = { Text("Desconectar aparelho?") },
            text = { Text("Isto vai remover todas as credenciais deste aparelho. Você precisará reconectar para usar o gateway.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        showDisconnectDialog = false
                        onDisconnect()
                    },
                    colors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colorScheme.error)
                ) { Text("Desconectar") }
            },
            dismissButton = {
                TextButton(onClick = { showDisconnectDialog = false }) { Text("Cancelar") }
            }
        )
    }
}

@Composable
private fun SettingsSectionHeader(title: String) {
    Text(
        text = title.uppercase(),
        style = MaterialTheme.typography.labelSmall,
        color = MaterialTheme.colorScheme.primary,
        modifier = Modifier.padding(start = 16.dp, top = 20.dp, bottom = 4.dp)
    )
}

@Composable
private fun SettingsRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String? = null,
    subtitleFont: FontFamily = FontFamily.Default,
    titleColor: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.onSurface,
    onClick: (() -> Unit)? = null,
    trailing: @Composable (() -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(24.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, style = MaterialTheme.typography.bodyLarge, color = titleColor)
            subtitle?.let {
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodySmall.copy(fontFamily = subtitleFont),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        trailing?.invoke()
    }
}

@Composable
private fun SettingsSwitchRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String? = null,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(24.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, style = MaterialTheme.typography.bodyLarge)
            subtitle?.let {
                Text(text = it, style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        Switch(checked = checked, onCheckedChange = onCheckedChange)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SimSelectionRow(
    sims: List<SimOption>,
    selectedId: Int,
    onSelect: (Int) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val selectedSim = sims.find { it.subscriptionId == selectedId }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = Icons.Default.SimCard,
            contentDescription = null,
            modifier = Modifier.size(24.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = "SIM padrão", style = MaterialTheme.typography.bodyLarge)
            ExposedDropdownMenuBox(
                expanded = expanded,
                onExpandedChange = { expanded = !expanded }
            ) {
                OutlinedTextField(
                    value = selectedSim?.let { "${it.displayName} · ID: ${it.subscriptionId}" }
                        ?: "Device Default",
                    onValueChange = {},
                    readOnly = true,
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                    modifier = Modifier
                        .menuAnchor()
                        .fillMaxWidth(),
                    textStyle = MaterialTheme.typography.bodySmall
                )
                ExposedDropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("Device Default") },
                        onClick = {
                            onSelect(-1)
                            expanded = false
                        }
                    )
                    sims.forEach { sim ->
                        DropdownMenuItem(
                            text = { Text("${sim.displayName} · ID: ${sim.subscriptionId}") },
                            onClick = {
                                onSelect(sim.subscriptionId)
                                expanded = false
                            }
                        )
                    }
                }
            }
        }
    }
}
