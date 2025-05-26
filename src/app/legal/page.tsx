// src/app/legal/page.tsx
export default function Legal() {
    return (
      <div className="mx-auto max-w-2xl p-6 space-y-4 text-sm leading-6">
        <h1 className="text-2xl font-semibold">Disclaimer</h1>
  
        <p>
          ETF Stack is an educational tool. Nothing on this site constitutes
          investment advice, investment recommendations, an offer
          (or solicitation) to buy or sell any securities, or a promise of any
          investment outcome. ETF Stack is not a registered investment adviser.
        </p>
  
        <p>
          All information is provided “as is” without warranty of any kind. Data
          may be inaccurate or incomplete. You are solely responsible for your
          investment decisions and should consult a licensed professional before
          buying or selling any security.
        </p>
  
        <p>
          By using this site you agree to ETF Stack’s{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and acknowledge that past performance is not indicative of future
          results.
        </p>
      </div>
    );
  }
  