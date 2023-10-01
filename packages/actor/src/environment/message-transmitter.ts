export abstract class MessageTransmitter {
  abstract send(address: string, message: any): void;
}
