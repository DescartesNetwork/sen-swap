import moment from 'moment'

const SECOND_PER_MILLISECOND = 1000

export enum TimeFormat {
  YMD = 'YYYYMMDD',
  SortableTimePattern = 'YYYY-MM-DD HH:mm:ss',
}

export class DateHelper {
  private milliSeconds: number = new Date().valueOf()

  setMilliSeconds(milliSeconds: number) {
    this.milliSeconds = milliSeconds
  }

  static fromSeconds(seconds: number): DateHelper {
    const date = new DateHelper()
    const milliSeconds = seconds * SECOND_PER_MILLISECOND
    date.setMilliSeconds(milliSeconds)
    return date
  }

  static fromYmd(ymd: number): DateHelper {
    const date = new DateHelper()
    const milliSeconds = moment(ymd, TimeFormat.YMD).valueOf()
    date.setMilliSeconds(milliSeconds)
    return date
  }

  static getListDate(ymdFrom: number, ymdTo: number): number[] {
    const dates: number[] = []
    let dateFrom = DateHelper.fromYmd(ymdFrom)
    const dateTo = DateHelper.fromYmd(ymdTo)
    while (dateFrom.ymd() <= dateTo.ymd()) {
      dates.push(dateFrom.ymd())
      dateFrom = dateFrom.addDay()
    }
    return dates
  }

  format(dateFormat: TimeFormat): string {
    const date = new Date(this.milliSeconds)
    return moment(date).format(dateFormat)
  }

  subtractDay(dayAmount: number = 1): DateHelper {
    const milliSeconds = moment(this.milliSeconds)
      .subtract(dayAmount, 'days')
      .valueOf()
    const date = DateHelper.fromSeconds(milliSeconds / SECOND_PER_MILLISECOND)
    return date
  }

  addDay(dayAmount: number = 1): DateHelper {
    const milliSeconds = moment(this.milliSeconds)
      .add(dayAmount, 'days')
      .valueOf()
    const date = DateHelper.fromSeconds(milliSeconds / SECOND_PER_MILLISECOND)
    return date
  }

  seconds(): number {
    return (
      (this.milliSeconds - (this.milliSeconds % SECOND_PER_MILLISECOND)) /
      SECOND_PER_MILLISECOND
    )
  }

  ymd(): number {
    return Number(this.format(TimeFormat.YMD))
  }

  static today(format: string = TimeFormat.YMD): string {
    return moment().format(format)
  }
}
