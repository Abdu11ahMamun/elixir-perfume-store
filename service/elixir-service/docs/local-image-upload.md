# Local Image Upload

## Overview

ÉLIXIR uses local VPS filesystem storage for product images.

This replaces the earlier Cloudinary direction.

Uploads are handled through the admin media endpoint:

```text
POST /api/v1/admin/media/images

app.upload.base-dir=uploads
app.upload.public-path=/uploads

app.upload.base-dir=/opt/elixir/uploads
app.upload.public-path=/uploads
```
