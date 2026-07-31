---
name: ClosedPosition field names
description: The ClosedPosition type from use-closed-positions.ts does not have profit/underlying/entry_spot/exit_spot fields.
---

# ClosedPosition interface — available fields

The `ClosedPosition` type (from `artifacts/trading-app/src/hooks/use-closed-positions.ts`) has:
- `contract_id`, `contract_type`, `buy_price`, `sell_price`, `payout`
- `longcode`, `underlying_symbol`, `purchase_time`, `sell_time`
- `shortcode`, `transaction_id`, `duration_type`

**Missing fields (never existed):** `profit`, `underlying`, `entry_spot`, `exit_spot`

**How to apply:**
- P/L = `pos.sell_price - pos.buy_price`
- Symbol = `pos.underlying_symbol`
- Always guard with `(closedPositions ?? [])` for pre-load renders
