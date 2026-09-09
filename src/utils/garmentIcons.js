// ───────────────────────────────────────────────────────────────────
// Garment Icon Mapper — Maps item names to relevant emoji + gradient
// Replaces generic placeholder images with unique, beautiful icons
// ───────────────────────────────────────────────────────────────────

// Each garment keyword maps to: { emoji, gradient (CSS background) }
const GARMENT_ICON_MAP = [
  // ── Women's Clothing ──
  { keywords: ['saree', 'sari'],                       emoji: '🥻', gradient: 'linear-gradient(135deg, #FF6B9D, #C850C0)' },
  { keywords: ['lehnga', 'lehenga', 'ghagra'],         emoji: '👗', gradient: 'linear-gradient(135deg, #FF4E8E, #E040AF)' },
  { keywords: ['gown'],                                 emoji: '👗', gradient: 'linear-gradient(135deg, #A855F7, #7C3AED)' },
  { keywords: ['dupatta'],                               emoji: '🧣', gradient: 'linear-gradient(135deg, #FB923C, #F97316)' },
  { keywords: ['blouse'],                                emoji: '👚', gradient: 'linear-gradient(135deg, #EC4899, #DB2777)' },
  { keywords: ['salwar'],                                emoji: '👖', gradient: 'linear-gradient(135deg, #F472B6, #E879A2)' },
  { keywords: ['plazo', 'palazzo'],                      emoji: '👖', gradient: 'linear-gradient(135deg, #A78BFA, #8B5CF6)' },
  { keywords: ['skirt'],                                 emoji: '👗', gradient: 'linear-gradient(135deg, #F9A8D4, #F472B6)' },
  { keywords: ['petti coat', 'petticoat'],               emoji: '👗', gradient: 'linear-gradient(135deg, #FCA5A5, #F87171)' },
  { keywords: ['ladies suit'],                           emoji: '👘', gradient: 'linear-gradient(135deg, #C084FC, #A855F7)' },
  { keywords: ['frock', 'child frock'],                  emoji: '👧', gradient: 'linear-gradient(135deg, #FDA4AF, #FB7185)' },
  { keywords: ['top plain', 'top heavy', 'top very'],    emoji: '👚', gradient: 'linear-gradient(135deg, #67E8F9, #22D3EE)' },
  { keywords: ['sameez', 'kameez'],                      emoji: '👘', gradient: 'linear-gradient(135deg, #C084FC, #9333EA)' },
  { keywords: ['rajputi poshak', 'poshak'],              emoji: '👸', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
  { keywords: ['sharara', 'sarara'],                     emoji: '👗', gradient: 'linear-gradient(135deg, #FB7185, #F43F5E)' },

  // ── Men's Clothing ──
  { keywords: ['sherwani'],                              emoji: '🤵', gradient: 'linear-gradient(135deg, #C4985A, #B07D40)' },
  { keywords: ['suit 3pcs', 'suit 2pcs', 'suit 3 pcs', 'suit 2 pcs', 'safari suit'], emoji: '🤵', gradient: 'linear-gradient(135deg, #1E3A5F, #2563EB)' },
  { keywords: ['blazer'],                                emoji: '🧥', gradient: 'linear-gradient(135deg, #334155, #475569)' },
  { keywords: ['shirt'],                                 emoji: '👔', gradient: 'linear-gradient(135deg, #60A5FA, #3B82F6)' },
  { keywords: ['t shirt', 't-shirt', 'tshirt'],          emoji: '👕', gradient: 'linear-gradient(135deg, #34D399, #10B981)' },
  { keywords: ['kurta', 'kameez'],                       emoji: '👘', gradient: 'linear-gradient(135deg, #FBBF24, #F59E0B)' },
  { keywords: ['achkan'],                                emoji: '🧥', gradient: 'linear-gradient(135deg, #C4985A, #92621E)' },
  { keywords: ['waist coat'],                            emoji: '🦺', gradient: 'linear-gradient(135deg, #6B7280, #4B5563)' },
  { keywords: ['dhoti'],                                 emoji: '🩲', gradient: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' },
  { keywords: ['lungi'],                                 emoji: '🩲', gradient: 'linear-gradient(135deg, #A3E635, #84CC16)' },
  { keywords: ['turban', 'pagadi', 'saafa'],             emoji: '🧕', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
  { keywords: ['rumala'],                                emoji: '🙏', gradient: 'linear-gradient(135deg, #F59E0B, #EA580C)' },

  // ── Pants & Lower Wear ──
  { keywords: ['pant', 'trouser'],                       emoji: '👖', gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)' },
  { keywords: ['jeans'],                                 emoji: '👖', gradient: 'linear-gradient(135deg, #1D4ED8, #2563EB)' },
  { keywords: ['shorts', 'capri'],                       emoji: '🩳', gradient: 'linear-gradient(135deg, #14B8A6, #0D9488)' },
  { keywords: ['leggings'],                              emoji: '👖', gradient: 'linear-gradient(135deg, #1F2937, #374151)' },
  { keywords: ['lower', 'track pant'],                   emoji: '🩳', gradient: 'linear-gradient(135deg, #6B7280, #9CA3AF)' },
  { keywords: ['payjama', 'pyjama'],                     emoji: '🩳', gradient: 'linear-gradient(135deg, #93C5FD, #60A5FA)' },
  { keywords: ['sweat pant'],                            emoji: '🩳', gradient: 'linear-gradient(135deg, #4B5563, #6B7280)' },

  // ── Outerwear ──
  { keywords: ['leather jacket'],                        emoji: '🧥', gradient: 'linear-gradient(135deg, #78350F, #92400E)' },
  { keywords: ['jacket'],                                emoji: '🧥', gradient: 'linear-gradient(135deg, #1F2937, #374151)' },
  { keywords: ['coat'],                                  emoji: '🧥', gradient: 'linear-gradient(135deg, #44403C, #57534E)' },
  { keywords: ['over coat', 'overcoat'],                 emoji: '🧥', gradient: 'linear-gradient(135deg, #292524, #44403C)' },
  { keywords: ['windcheater'],                           emoji: '🧥', gradient: 'linear-gradient(135deg, #0EA5E9, #0284C7)' },
  { keywords: ['pullover'],                              emoji: '🧶', gradient: 'linear-gradient(135deg, #9D174D, #BE185D)' },
  { keywords: ['sweater', 'cardigan'],                   emoji: '🧶', gradient: 'linear-gradient(135deg, #B45309, #D97706)' },
  { keywords: ['sweat shirt', 'hoodie', 'hood'],         emoji: '🧥', gradient: 'linear-gradient(135deg, #4338CA, #6366F1)' },
  { keywords: ['dangree', 'dungaree', 'dargree'],        emoji: '🧑‍🔧', gradient: 'linear-gradient(135deg, #2563EB, #3B82F6)' },
  { keywords: ['stall', 'stole'],                        emoji: '🧣', gradient: 'linear-gradient(135deg, #DC2626, #EF4444)' },
  { keywords: ['shawl', 'pashmina'],                     emoji: '🧣', gradient: 'linear-gradient(135deg, #9A3412, #C2410C)' },
  { keywords: ['scarf'],                                 emoji: '🧣', gradient: 'linear-gradient(135deg, #E11D48, #F43F5E)' },

  // ── Inner Wear ──
  { keywords: ['vest', 'baniyan', 'baniean'],            emoji: '🩲', gradient: 'linear-gradient(135deg, #E5E7EB, #D1D5DB)' },
  { keywords: ['panty', 'under wear', 'underwear', 'inner'], emoji: '🩲', gradient: 'linear-gradient(135deg, #FECACA, #FCA5A5)' },
  { keywords: ['swimming'],                              emoji: '🩱', gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)' },

  // ── Dress ──
  { keywords: ['dress heavy', 'dress normal', 'dress'],  emoji: '👗', gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' },

  // ── Accessories ──
  { keywords: ['tie', 'bow tie'],                        emoji: '👔', gradient: 'linear-gradient(135deg, #7C2D12, #9A3412)' },
  { keywords: ['cap', 'hat'],                            emoji: '🧢', gradient: 'linear-gradient(135deg, #1D4ED8, #3B82F6)' },
  { keywords: ['apron'],                                 emoji: '🧑‍🍳', gradient: 'linear-gradient(135deg, #F5F5F4, #E7E5E4)' },
  { keywords: ['lab coat'],                              emoji: '🥼', gradient: 'linear-gradient(135deg, #F0FDFA, #CCFBF1)' },
  { keywords: ['jumper'],                                emoji: '🧶', gradient: 'linear-gradient(135deg, #059669, #10B981)' },

  // ── Home & Household ──
  { keywords: ['curtain'],                               emoji: '🪟', gradient: 'linear-gradient(135deg, #C2785C, #A0522D)' },
  { keywords: ['blinds'],                                emoji: '🪟', gradient: 'linear-gradient(135deg, #9CA3AF, #6B7280)' },
  { keywords: ['carpet'],                                emoji: '🧶', gradient: 'linear-gradient(135deg, #7C2D12, #B45309)' },
  { keywords: ['bed spread', 'comforter'],               emoji: '🛏️', gradient: 'linear-gradient(135deg, #6366F1, #818CF8)' },
  { keywords: ['bedsheet'],                              emoji: '🛏️', gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
  { keywords: ['blanket', 'quilt'],                      emoji: '🛌', gradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)' },
  { keywords: ['pillow', 'cushion'],                     emoji: '🛋️', gradient: 'linear-gradient(135deg, #A78BFA, #C4B5FD)' },
  { keywords: ['sofa'],                                  emoji: '🛋️', gradient: 'linear-gradient(135deg, #8B4513, #A0522D)' },
  { keywords: ['table cloth', 'table mat'],              emoji: '🍽️', gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
  { keywords: ['towel'],                                 emoji: '🧖', gradient: 'linear-gradient(135deg, #38BDF8, #7DD3FC)' },
  { keywords: ['foot mat'],                              emoji: '🚪', gradient: 'linear-gradient(135deg, #78716C, #A8A29E)' },

  // ── Shoes ──
  { keywords: ['leather shoes'],                         emoji: '👞', gradient: 'linear-gradient(135deg, #78350F, #92400E)' },
  { keywords: ['sports shoe', 'sneaker', 'canvas shoe'], emoji: '👟', gradient: 'linear-gradient(135deg, #3B82F6, #6366F1)' },
  { keywords: ['suede shoe'],                            emoji: '👞', gradient: 'linear-gradient(135deg, #92400E, #B45309)' },
  { keywords: ['boot'],                                  emoji: '🥾', gradient: 'linear-gradient(135deg, #44403C, #57534E)' },
  { keywords: ['slipper'],                               emoji: '🩴', gradient: 'linear-gradient(135deg, #F97316, #FB923C)' },
  { keywords: ['sandel', 'sandal'],                      emoji: '👡', gradient: 'linear-gradient(135deg, #D97706, #F59E0B)' },
  { keywords: ['shoe'],                                  emoji: '👟', gradient: 'linear-gradient(135deg, #2563EB, #3B82F6)' },

  // ── Bags ──
  { keywords: ['handbag'],                               emoji: '👜', gradient: 'linear-gradient(135deg, #92400E, #B45309)' },
  { keywords: ['trolley bag'],                           emoji: '🧳', gradient: 'linear-gradient(135deg, #1E40AF, #2563EB)' },
  { keywords: ['bagpack', 'backpack', 'bag pack', 'mountainers'], emoji: '🎒', gradient: 'linear-gradient(135deg, #DC2626, #EF4444)' },

  // ── Toys & Misc ──
  { keywords: ['soft toy'],                              emoji: '🧸', gradient: 'linear-gradient(135deg, #FBBF24, #F59E0B)' },
  
  // ── Laundry Services (per kg) ──
  { keywords: ['wash & fold', 'wash and fold'],          emoji: '🧺', gradient: 'linear-gradient(135deg, #3C8B35, #27A243)' },
  { keywords: ['wash & steam', 'wash & iron', 'wash and iron', 'wash and steam'], emoji: '♨️', gradient: 'linear-gradient(135deg, #0891B2, #06B6D4)' },
  { keywords: ['premium laundry'],                       emoji: '✨', gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)' },
  { keywords: ['woolen laundry', 'woolen'],              emoji: '🧶', gradient: 'linear-gradient(135deg, #B45309, #D97706)' },
  { keywords: ['hygiene laundry'],                       emoji: '🧴', gradient: 'linear-gradient(135deg, #0284C7, #0EA5E9)' },
  { keywords: ['laundry'],                               emoji: '🧺', gradient: 'linear-gradient(135deg, #2563EB, #3B82F6)' },
];

// Fallback icons based on service type
const SERVICE_FALLBACKS = {
  dry_clean:  { emoji: '🧼', gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)' },
  steam_iron: { emoji: '♨️', gradient: 'linear-gradient(135deg, #EF4444, #F97316)' },
  laundry:    { emoji: '🧺', gradient: 'linear-gradient(135deg, #3C8B35, #27A243)' },
  shoe_care:  { emoji: '👟', gradient: 'linear-gradient(135deg, #2563EB, #3B82F6)' },
  accessories:{ emoji: '👜', gradient: 'linear-gradient(135deg, #B45309, #D97706)' },
};

/**
 * Returns { emoji, gradient } for a given item.
 * @param {Object} item - Catalog item with `name` and `serviceKey` fields.
 * @returns {{ emoji: string, gradient: string }}
 */
export function getGarmentIcon(item) {
  const name = (item.name || '').toLowerCase();

  // Try keyword matching (first match wins — order matters!)
  for (const entry of GARMENT_ICON_MAP) {
    for (const kw of entry.keywords) {
      if (name.includes(kw)) {
        return { emoji: entry.emoji, gradient: entry.gradient };
      }
    }
  }

  // Fallback to service type
  const serviceKey = (item.serviceKey || item.category || '').toLowerCase();
  if (SERVICE_FALLBACKS[serviceKey]) {
    return SERVICE_FALLBACKS[serviceKey];
  }

  // Ultimate fallback
  return { emoji: '👕', gradient: 'linear-gradient(135deg, #6B7280, #9CA3AF)' };
}
