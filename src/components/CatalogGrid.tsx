'use client';

import { motion } from 'framer-motion';
import type { Kebaya } from '@/types';
import KebayaCard from './KebayaCard';
import { cn } from '@/lib/utils';

interface CatalogGridProps {
  /** Kebaya collection already resolved by the store / server bootstrap. */
  kebayas: Kebaya[];
  className?: string;
}

/**
 * Responsive catalog grid.
 *
 * Each card renders through `KebayaCard` -> `SafeImage`, so broken or
 * restricted Google Drive photos automatically fall back to the branded
 * placeholder instead of collapsing the layout.
 */
export default function CatalogGrid({ kebayas, className }: CatalogGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8',
        className
      )}
    >
      {kebayas.map((kebaya, index) => (
        <motion.div
          key={kebaya.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 * index }}
        >
          <KebayaCard kebaya={kebaya} />
        </motion.div>
      ))}
    </motion.div>
  );
}
