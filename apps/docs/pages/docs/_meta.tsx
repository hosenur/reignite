import { Box, Boxes, Package, PencilRuler, Scan, Zap } from "lucide-react";

export default {
  index: {
    title: (
      <div className="flex gap-1 items-center">
        <Zap className="w-4" />
        Introduction
      </div>
    )

  },
  setup: {
    title: (
      <div className="flex gap-1 items-center">
        <PencilRuler className="w-4" />
        Setup
      </div>
    )
  },
  apps: {
    title: (
      <div className="flex gap-1 items-center">
        <Box className="w-4" />
        Apps
      </div>
    )
  },
  packages: {
    title: (
      <div className="flex gap-1 items-center">
        <Package className="w-4" />
        Packages
      </div>
    )
  },
}