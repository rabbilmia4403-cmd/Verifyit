---
name: Gemini model availability
description: Provider-specific model access changes and diagnostics for the direct Gemini API integration.
---

The direct Gemini API can return HTTP 404 for a model that remains documented when that model is no longer available to new users. The provider response may name the currently available replacement; preserve that diagnostic instead of masking it as a generic status-only error.

**Why:** A request using the documented `gemini-2.5-flash` model returned a provider message recommending `gemini-3.6-flash`. The replacement reached the provider successfully, which returned a temporary capacity response rather than a model-not-found error.

**How to apply:** When a Gemini model request returns 404, inspect the provider error body, verify the `v1beta/models/{model}:generateContent` URL, and follow the provider’s explicit model replacement guidance.