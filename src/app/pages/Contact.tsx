import { Phone, Mail, MapPin, Send, ShoppingCart, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

// Cart items would come from context in production
=======
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, ShoppingCart, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BuilderElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  styles: Record<string, string>;
}

// Cart items would come from context in production
