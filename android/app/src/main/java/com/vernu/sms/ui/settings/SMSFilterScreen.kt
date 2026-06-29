package com.vernu.sms.ui.settings

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.vernu.sms.helpers.SMSFilterHelper
import com.vernu.sms.models.SMSFilterRule

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SMSFilterScreen(
    onNavigateBack: () -> Unit,
    viewModel: SMSFilterViewModel = viewModel()
) {
    val config by viewModel.config.collectAsState()
    var showDialog by remember { mutableStateOf(false) }
    var editingIndex by remember { mutableStateOf<Int?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Filtros de SMS", fontWeight = FontWeight.SemiBold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Voltar")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = {
                editingIndex = null
                showDialog = true
            }) {
                Icon(Icons.Default.Add, contentDescription = "Adicionar regra")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("Ativar filtragem de SMS", style = MaterialTheme.typography.bodyLarge)
                    Text(
                        "Filtre os SMS recebidos com base nas regras abaixo",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Switch(
                    checked = config.enabled,
                    onCheckedChange = { viewModel.setEnabled(it) }
                )
            }

            Divider()

            if (config.enabled) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    FilterChip(
                        selected = config.mode == SMSFilterHelper.FilterMode.ALLOW_LIST,
                        onClick = { viewModel.setMode(SMSFilterHelper.FilterMode.ALLOW_LIST) },
                        label = { Text("Lista de permissão") }
                    )
                    FilterChip(
                        selected = config.mode == SMSFilterHelper.FilterMode.BLOCK_LIST,
                        onClick = { viewModel.setMode(SMSFilterHelper.FilterMode.BLOCK_LIST) },
                        label = { Text("Lista de bloqueio") }
                    )
                }
                Text(
                    text = if (config.mode == SMSFilterHelper.FilterMode.ALLOW_LIST)
                        "Só SMS que casam com uma regra serão encaminhados"
                    else
                        "SMS que casam com uma regra serão bloqueados",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(start = 16.dp, end = 16.dp, bottom = 8.dp)
                )
                Divider()
            }

            if (config.rules.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            Icons.Default.FilterList,
                            contentDescription = null,
                            modifier = Modifier.size(48.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            "Nenhuma regra de filtro",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            "Toque em + para adicionar uma regra",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            } else {
                LazyColumn(modifier = Modifier.weight(1f)) {
                    itemsIndexed(config.rules) { index, rule ->
                        FilterRuleRow(
                            rule = rule,
                            onEdit = {
                                editingIndex = index
                                showDialog = true
                            },
                            onDelete = { viewModel.deleteRule(index) }
                        )
                        if (index < config.rules.lastIndex) {
                            Divider(modifier = Modifier.padding(start = 16.dp))
                        }
                    }
                }
            }
        }
    }

    if (showDialog) {
        FilterRuleDialog(
            rule = editingIndex?.let { config.rules.getOrNull(it) },
            onConfirm = { rule ->
                val idx = editingIndex
                if (idx != null) viewModel.updateRule(idx, rule) else viewModel.addRule(rule)
                showDialog = false
            },
            onDismiss = { showDialog = false }
        )
    }
}

@Composable
private fun FilterRuleRow(
    rule: SMSFilterRule,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onEdit)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = rule.pattern ?: "",
                fontWeight = FontWeight.SemiBold,
                style = MaterialTheme.typography.bodyLarge
            )
            Spacer(modifier = Modifier.height(4.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                SuggestionChip(
                    onClick = {},
                    label = {
                        Text(
                            rule.matchType?.name?.replace('_', ' ')
                                ?.lowercase()?.replaceFirstChar { it.uppercaseChar() } ?: "",
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                )
                SuggestionChip(
                    onClick = {},
                    label = {
                        Text(
                            rule.filterTarget.name.lowercase().replaceFirstChar { it.uppercaseChar() },
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                )
                if (rule.caseSensitive) {
                    SuggestionChip(
                        onClick = {},
                        label = { Text("Diferenciar maiúsculas", style = MaterialTheme.typography.labelSmall) }
                    )
                }
            }
        }
        IconButton(onClick = onDelete) {
            Icon(
                Icons.Default.Delete,
                contentDescription = "Excluir regra",
                tint = MaterialTheme.colorScheme.error
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun FilterRuleDialog(
    rule: SMSFilterRule?,
    onConfirm: (SMSFilterRule) -> Unit,
    onDismiss: () -> Unit
) {
    var pattern by remember(rule) { mutableStateOf(rule?.pattern ?: "") }
    var matchType by remember(rule) {
        mutableStateOf(rule?.matchType ?: SMSFilterRule.MatchType.CONTAINS)
    }
    var filterTarget by remember(rule) {
        mutableStateOf(rule?.filterTarget ?: SMSFilterRule.FilterTarget.SENDER)
    }
    var caseSensitive by remember(rule) { mutableStateOf(rule?.caseSensitive ?: false) }
    var matchTypeExpanded by remember { mutableStateOf(false) }
    var filterTargetExpanded by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (rule == null) "Adicionar regra" else "Editar regra") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = pattern,
                    onValueChange = { pattern = it },
                    label = { Text("Padrão") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                ExposedDropdownMenuBox(
                    expanded = filterTargetExpanded,
                    onExpandedChange = { filterTargetExpanded = !filterTargetExpanded }
                ) {
                    OutlinedTextField(
                        value = filterTarget.name.lowercase()
                            .replaceFirstChar { it.uppercaseChar() },
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Alvo do filtro") },
                        trailingIcon = {
                            ExposedDropdownMenuDefaults.TrailingIcon(expanded = filterTargetExpanded)
                        },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = filterTargetExpanded,
                        onDismissRequest = { filterTargetExpanded = false }
                    ) {
                        SMSFilterRule.FilterTarget.values().forEach { target ->
                            DropdownMenuItem(
                                text = {
                                    Text(target.name.lowercase().replaceFirstChar { it.uppercaseChar() })
                                },
                                onClick = {
                                    filterTarget = target
                                    filterTargetExpanded = false
                                }
                            )
                        }
                    }
                }

                ExposedDropdownMenuBox(
                    expanded = matchTypeExpanded,
                    onExpandedChange = { matchTypeExpanded = !matchTypeExpanded }
                ) {
                    OutlinedTextField(
                        value = matchType.name.replace('_', ' ').lowercase()
                            .replaceFirstChar { it.uppercaseChar() },
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Tipo de correspondência") },
                        trailingIcon = {
                            ExposedDropdownMenuDefaults.TrailingIcon(expanded = matchTypeExpanded)
                        },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = matchTypeExpanded,
                        onDismissRequest = { matchTypeExpanded = false }
                    ) {
                        SMSFilterRule.MatchType.values().forEach { type ->
                            DropdownMenuItem(
                                text = {
                                    Text(
                                        type.name.replace('_', ' ').lowercase()
                                            .replaceFirstChar { it.uppercaseChar() }
                                    )
                                },
                                onClick = {
                                    matchType = type
                                    matchTypeExpanded = false
                                }
                            )
                        }
                    }
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        "Diferenciar maiúsculas",
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.weight(1f)
                    )
                    Switch(checked = caseSensitive, onCheckedChange = { caseSensitive = it })
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    onConfirm(SMSFilterRule(pattern.trim(), matchType, filterTarget, caseSensitive))
                },
                enabled = pattern.isNotBlank()
            ) { Text("Salvar") }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancelar") }
        }
    )
}
