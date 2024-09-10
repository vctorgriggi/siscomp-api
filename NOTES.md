## Decisões de Implementação

### Comparação de Strings

Atualmente, estamos usando o operador `iLike` do Sequelize para comparações de strings. No PostgreSQL, o operador `iLike` realiza comparações case-insensitive, o que é adequado para o ambiente de produção em que estamos trabalhando.

**Operador atual:**

- **iLike:** Comparação case-insensitive no PostgreSQL.

**Considerações para SQLite:**

No SQLite, o operador `iLike` não é suportado e o operador `like` realiza comparações case-insensitive por padrão. Portanto, para garantir comparações case-insensitive no SQLite, será necessário usar o operador `like`.

**Operador recomendado para SQLite:**

- **like:** Comparação case-insensitive.

Caso decidamos utilizar um ambiente de desenvolvimento com SQLite, lembre-se de ajustar a lógica de comparação para usar o operador `like`.
