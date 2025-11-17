'use client';

interface AnalysisPanelProps {
  metrics: {
    speed: string;
    releaseAngle: string;
    pitchPoint: string;
    swing: string;
    spin: string;
    seam: string;
    impactPoint: {
      x: string;
      y: string;
      z: string;
    };
    prediction: string;
    lineLength: string;
  };
}

export default function AnalysisPanel({ metrics }: AnalysisPanelProps) {
  const isPredictionHitting = metrics.prediction.includes('Hitting');

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-500/20 p-3 rounded-lg">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white">Analysis Results</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <MetricCard
          label="Ball Speed"
          value={`${metrics.speed} km/h`}
          icon="⚡"
          color="text-yellow-400"
        />
        <MetricCard
          label="Release Angle"
          value={`${metrics.releaseAngle}°`}
          icon="📐"
          color="text-blue-400"
        />
        <MetricCard
          label="Pitch Point"
          value={`${metrics.pitchPoint}m`}
          icon="🎯"
          color="text-purple-400"
        />
        <MetricCard
          label="Swing"
          value={`${metrics.swing}°`}
          icon="↪️"
          color="text-orange-400"
        />
        <MetricCard
          label="Spin RPM"
          value={metrics.spin}
          icon="🌀"
          color="text-cyan-400"
        />
        <MetricCard
          label="Seam Position"
          value={`${metrics.seam}°`}
          icon="⚾"
          color="text-pink-400"
        />
      </div>

      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 mb-4">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Impact Point (x, y, z)</h4>
        <p className="text-white font-mono">
          ({metrics.impactPoint.x}, {metrics.impactPoint.y}, {metrics.impactPoint.z}) meters
        </p>
      </div>

      <div className={`rounded-xl p-6 text-center border-2 ${
        isPredictionHitting
          ? 'bg-red-500/20 border-red-500/50'
          : 'bg-blue-500/20 border-blue-500/50'
      }`}>
        <div className="text-3xl mb-2">{isPredictionHitting ? '🎯' : '↗️'}</div>
        <p className="text-sm text-gray-400 mb-1">DRS Prediction</p>
        <p className={`text-2xl font-bold ${isPredictionHitting ? 'text-red-400' : 'text-blue-400'}`}>
          {metrics.prediction}
        </p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-green-500/50 transition-all">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
