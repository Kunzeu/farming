'use client';

import React from 'react';
import { motion } from 'framer-motion';

type Props = React.ComponentProps<any> & { as?: string };

export default function EctoplasmMotion({ as = 'div', children, ...props }: Props) {
  const Comp = (motion as any)[as] || motion.div;
  return <Comp {...props}>{children}</Comp>;
}
