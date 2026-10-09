import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      tenantSlug?: string;
    }
  }
}

export function tenantContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const slugFromParam = typeof req.params.tenantSlug === 'string' ? req.params.tenantSlug : undefined;
  const rawSlugHeader = req.headers['x-tenant-slug'];
  const slugFromHeader: string | undefined = typeof rawSlugHeader === 'string' 
    ? rawSlugHeader 
    : Array.isArray(rawSlugHeader) ? rawSlugHeader[0] : undefined;

  const rawTenantId = req.headers['x-tenant-id'];
  const tenantIdHeader: string | undefined = typeof rawTenantId === 'string'
    ? rawTenantId
    : Array.isArray(rawTenantId) ? rawTenantId[0] : undefined;

  if (slugFromParam || slugFromHeader) {
    req.tenantSlug = slugFromParam || slugFromHeader;
  }

  if (tenantIdHeader) {
    req.tenantId = tenantIdHeader;
  }

  next();
}
