import { Component, lazy, Suspense, type ComponentType, type ReactNode } from "react";

import { ErrorState, LoadingState } from "@/components/data";
import { FIGURES, type FigureId } from "@/content/figures";

import "@/visualizations/source-figures.css";
import "@/visualizations/source-report.css";

const OccupationExplorer = lazy(() => import("@/visualizations/OccupationExplorer"));
const LeverageJackknife = lazy(() => import("@/visualizations/LeverageJackknife"));
const Trajectory = lazy(() => import("@/visualizations/Trajectory"));
const PlaceboWindows = lazy(() => import("@/visualizations/PlaceboWindows"));
const WagePremium = lazy(() => import("@/visualizations/WagePremium"));
const DestinationScarcity = lazy(() => import("@/visualizations/DestinationScarcity"));

const CHARTS: Record<FigureId, ComponentType> = {
  landscape: OccupationExplorer,
  leverage: LeverageJackknife,
  history: Trajectory,
  placebo: PlaceboWindows,
  wages: WagePremium,
  pathways: DestinationScarcity,
};

class FigureBoundary extends Component<
  { children: ReactNode; title: string },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode; title: string }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override render() {
    if (this.state.error) {
      return (
        <ErrorState
          title={`${this.props.title} did not load`}
          body="The interactive figure failed. The report text and the static images in the section remain the published record."
        />
      );
    }
    return this.props.children;
  }
}

export function LiveFigure({ id }: { id: FigureId }) {
  const fig = FIGURES[id];
  const Chart = CHARTS[id];

  return (
    <figure className="source-figure source-report live">
      <figcaption className="live__head">
        <p className="tier" data-tier={fig.tier}>
          {fig.tier}
        </p>
        <strong>{fig.title}</strong>
        <p>{fig.lede}</p>
      </figcaption>
      <FigureBoundary title={fig.title}>
        <Suspense fallback={<LoadingState label={`Loading ${fig.title}`} />}>
          <Chart />
        </Suspense>
      </FigureBoundary>
    </figure>
  );
}
