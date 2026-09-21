# Documento de Requisitos — Kanban Board (Projeto de Estudo)

## 1. Objetivo
Construir um quadro Kanban simples em HTML, CSS e JavaScript puro, com suporte a data limite e priorização MoSCoW, como prática de estudo ao longo de 14 dias (30 min/dia).

## 2. Estrutura do board
- 3 colunas fixas: **A Fazer**, **Fazendo**, **Feito**
- Sem criação/edição/exclusão de colunas

## 3. Campos do card (tarefa)
| Campo | Obrigatório | Observações |
|---|---|---|
| Título | Sim | Texto curto |
| Descrição | Não | Texto livre |
| Prioridade (MoSCoW) | Sim | Must / Should / Could / Won't |
| Data limite | Sim | Data única |

## 4. Funcionalidades (ações sobre o card)
- Criar tarefa
- Editar tarefa
- Excluir tarefa
- Mover tarefa entre colunas (drag and drop)
- Destaque visual quando a data limite já passou

## 5. Persistência
- Dados salvos localmente no navegador (localStorage)
- Sem backend, sem banco de dados

## 6. Fora do escopo (MVP)
- Login / múltiplos usuários
- Múltiplos boards
- Anexos, comentários, subtarefas
- Notificações

## 7. Stack técnica

### Front-end (dias 1-14)
- HTML5
- CSS3 (flexbox ou grid)
- JavaScript puro (sem framework)
- localStorage (persistência)
- Deploy: GitHub Pages ou Vercel

### Back-end (dias 15-21)
- Python + FastAPI
- SQLModel + SQLite
- Deploy: Render ou Railway

## 8. Cronograma

### Front-end (14 dias, 30 min/dia)
1. Planejamento e setup
2. Estrutura HTML
3. CSS base das colunas
4. CSS dos cards
5. Modelo de dados e renderização (JS)
6. Formulário de criar tarefa
7. Drag and drop (parte 1)
8. Drag and drop (parte 2)
9. Persistência com localStorage
10. Editar e excluir tarefas
11. Destaque de atraso e filtro MoSCoW
12. Responsividade e ajustes visuais
13. Revisão geral e refatoração
14. Deploy, README e retrospectiva

### Back-end (7 dias, 30 min/dia)
15. Setup do backend (FastAPI + SQLite)
16. Rotas de leitura e criação
17. Rotas de atualização e exclusão
18. Validação e tratamento de erros
19. Integração front-end com a API
20. Testes e ajustes de integração
21. Deploy do backend e retrospectiva final
