/** La Sesión 2 deja el servicio de préstamos como punto de extensión; por eso los handlers responden 501. */
export type LoanFilters = Record<string, unknown>;
export class LoanService {
  public static getLoansByFilter(_filters: LoanFilters): never[] {
    return [];
  }
}
