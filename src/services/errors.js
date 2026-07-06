export class SlotUnavailableError extends Error {
  constructor(message = 'This slot is no longer available.') {
    super(message)
    this.name = 'SlotUnavailableError'
  }
}

export class NotFoundError extends Error {
  constructor(message = 'The requested item was not found.') {
    super(message)
    this.name = 'NotFoundError'
  }
}
