# Guia de Estilo — Maras-Set-Kanban

## 1. Identidade
- **Nome do projeto:** Maras-Set-Kanban
- **Estilo visual:** Liquid Glass (Apple, iOS 26), com fundo colorido para o vidro refratar
- **Cores principais:** Azul e Amarelo

## 2. Tipografia
- **Fonte:** San Francisco (SF Pro)
- **Fallback stack (web):**
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif;
```
- `-apple-system` e `BlinkMacSystemFont` carregam a SF nativamente em dispositivos Apple; nos demais, cai no fallback mais próximo.

### Escala tipográfica
| Uso | Tamanho | Peso |
|---|---|---|
| Título do board | 28px | 700 (bold) |
| Título de coluna | 18px | 600 (semibold) |
| Título do card | 15px | 600 (semibold) |
| Texto/descrição | 13px | 400 (regular) |
| Badge/label (MoSCoW, data) | 11px | 600 (semibold), uppercase |

## 3. Paleta de cores

### Cores principais
| Nome | Hex | Uso |
|---|---|---|
| Azul primário | `#0A84FF` | Cor de marca, botões primários, tint do glass |
| Azul escuro | `#0040DD` | Hover/estados ativos, gradiente de fundo |
| Amarelo primário | `#FFDE21` | Destaque, CTA secundário, acento |
| Amarelo escuro | `#E6C400` | Hover do amarelo, alertas leves |

### Fundo (para o vidro refratar)
| Nome | Hex | Uso |
|---|---|---|
| Gradiente base | `linear-gradient(135deg, #0A84FF 0%, #001F54 50%, #FFDE21 100%)` | Fundo da página |
| Fundo escuro alternativo | `#0B0F1A` | Modo escuro, base neutra |

### Neutros
| Nome | Hex | Uso |
|---|---|---|
| Branco | `#FFFFFF` | Texto sobre glass escuro |
| Cinza texto | `#1C1C1E` | Texto principal (modo claro) |
| Cinza secundário | `rgba(255,255,255,0.7)` | Texto secundário sobre glass |

### Cores MoSCoW (nas badges dos cards)
| Prioridade | Cor | Hex |
|---|---|---|
| Must | Vermelho | `#FF453A` |
| Should | Amarelo (cor da marca) | `#FFDE21` |
| Could | Azul (cor da marca) | `#0A84FF` |
| Won't | Cinza | `rgba(255,255,255,0.4)` |

## 4. Bordas e raios
| Elemento | Raio |
|---|---|
| Board/container | 24px |
| Coluna | 20px |
| Card | 16px |
| Botão | 12px |
| Badge/tag | 999px (pill) |

## 5. Efeito Liquid Glass
```css
.glass {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.3);
}
```
- Fundo sempre com gradiente/cor por trás — vidro sobre fundo liso branco não gera o efeito
- Cor aplicada com moderação nos controles, para o conteúdo "brilhar através"
- Brilho especular sutil no topo via `inset box-shadow`

## 6. Espaçamento
- Unidade base: `8px`
- Padding de card: `16px`
- Gap entre colunas: `24px`
- Gap entre cards: `12px`

## 7. Sombras
| Nível | Uso | Valor |
|---|---|---|
| Baixa | Cards em repouso | `0 4px 16px rgba(0,0,0,0.1)` |
| Alta | Card sendo arrastado | `0 12px 40px rgba(0,0,0,0.25)` |

## 8. Princípios (herdados do Liquid Glass)
1. **Hierarquia** — conteúdo do card em foco; o glass eleva sem esconder
2. **Harmonia** — cantos arredondados consistentes entre board, coluna, card e botão
3. **Consistência** — mesmos padrões de cor, raio e glass em todos os componentes
