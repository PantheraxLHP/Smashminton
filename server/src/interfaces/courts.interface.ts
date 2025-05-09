export interface CourtPrices {
  zoneid: number;
  courtid: number;
  courtname: string | null;
  courtimgurl: string | null;
  dayfrom?: string | null;
  dayto?: string | null;
  date?: string;
  starttime: string;
  endtime: string;
  duration: number;
  price: number;
}
