import HeroImage from '@/components/HeroImage/HeroImage';
import SystemHealthCheck from '@/components/SystemHealthCheck/SystemHealthCheck';

function HeroImageRoute() {
  return (
    <div>
      <SystemHealthCheck />
      <HeroImage />
    </div>
  );
}

export default HeroImageRoute;
