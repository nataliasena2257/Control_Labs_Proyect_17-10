export type LoanFilters = Record<string, unknown>;

export class LoanService {
  /** Returns loans matching the provided filters. The persistence layer is not part of this project yet. */
  public static getLoansByFilter(_filters: LoanFilters): unknown[] {
    return [];
  }
}
