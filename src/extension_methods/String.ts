declare global {
  interface String {
      getRegions(): string[];
      getLastRegion(): string;
  }
}

String.prototype.getRegions = function(this: string) {
  return this.split('/');
};

String.prototype.getLastRegion = function(this: string) {
  return this.getRegions().pop();
};


export {};
  