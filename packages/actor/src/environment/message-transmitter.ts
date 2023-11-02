export abstract class MessageTransmitter {
  abstract send(address: string, message: any): void;
  abstract request(address: string, message: any): Promise<any>;
}
