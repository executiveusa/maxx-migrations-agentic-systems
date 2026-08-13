# MACS Public Site → MAXX Backend Contract

Target architecture only; implement after backend route/security review.

## Rule

Browser never receives backend service credentials or raw database access.

`macsdigitalmedia` uses a small server-side adapter/API route to forward bounded events to MAXX Migrations.

## Initial contract classes

- public intake/application submission;
- newsletter/contact consent;
- product/download interest;
- analytics/conversion event with minimal PII;
- webhook delivery status.

## Requirements

- server-side signing/authentication;
- schema validation and size limits;
- rate limiting/abuse controls;
- idempotency key for submissions;
- consent/source metadata;
- opaque receipt returned to public site;
- no arbitrary tenant ID from browser;
- no direct Supabase service-role key in storefront;
- durable evidence written by backend.

The public site may cache presentation content, but MAXX Migrations owns business process state.