// temporary workaround for waffle issue
// fix in this https://github.com/EthWorks/Waffle/pull/593

// near.ts
// Custom method : being near means being within the expected variance determined by MAX_VARIANCE
import { BigNumber } from "@ethersproject/bignumber";

export {};

const MAX_VARIANCE = 1000; // 0.1 % accepted variance

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Chai {
    interface Assertion {
      near(actual: BigNumber, maxVariance: number): void;
    }
  }
}

function max(x: BigNumber, y: BigNumber): BigNumber {
  return x.gte(y) ? x : y;
}

export function near(chai: Chai.ChaiStatic): void {
  const Assertion = chai.Assertion;
  Assertion.addMethod("near", function (actual: BigNumber, maxVariance: number): void {
    const expected = (this._obj as BigNumber).abs();
    const delta: BigNumber = expected.sub(actual.abs()).abs();
    this.assert(
      delta.lte(expected.div(maxVariance || MAX_VARIANCE)),
      "expected #{exp} to be near #{act}",
      "expected #{exp} to not be near #{act}",
      String(expected),
      String(actual)
    );
  });
}
