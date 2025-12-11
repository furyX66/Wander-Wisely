export interface IBudgetOption {
  id: string;
  label: Price;
}

type Price = "$ (Budget)" | "$$ (Moderate)" | "$$$ (Expensive)"| "$$$$ (Luxury)"
