export interface CourtPrices {
  courtid: number;
  courtname: string | null;
  courtimgurl: string | null;
  dayfrom?: string | null;
  dayto?: string | null;
  starttime: string;
  endtime: string;
  duration?: number;
  price: string;
}
