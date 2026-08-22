# Controlled Scraper Recovery

Use a staging copy of the YC Companies collector. Never deliberately break the production collector.

1. Run the staging collector and save a sanitized baseline JSON sample.
2. In Scraper Studio, introduce a harmless extraction failure for `description` while preserving the rest of the schema.
3. Run again and capture Pico marking invalid rows while retaining the previous live dataset.
4. From the coding-agent terminal, run:

   ```bash
   bdata scraper heal "$STAGING_COLLECTOR_ID" "The company description extraction is empty; restore the existing output contract."
   bdata scraper approve "$STAGING_COLLECTOR_ID"
   bdata scraper run "$STAGING_COLLECTOR_ID" https://www.ycombinator.com/companies
   ```

5. Save sanitized before, failed, and healed output samples. Confirm downstream Pico code is unchanged.
6. Record the collector run in the demo; do not commit IDs, API keys, cookies, or raw personal data.

This evidence must be captured from real runs. Do not present illustrative fixtures as a completed recovery.
