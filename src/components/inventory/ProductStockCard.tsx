import React from 'react';
import { Product, InventoryItem } from '../../types';
import { Zap, Boxes, ArrowRight } from 'lucide-react';

interface ProductStockCardProps {
  product: Product;
  inventoryItem?: InventoryItem;
  onViewDetails: (product: Product, item: InventoryItem) => void;
}

export const ProductStockCard: React.FC<ProductStockCardProps> = ({
  product,
  inventoryItem,
  onViewDetails
}) => {
  // Fallback inventory item if not passed
  const item: InventoryItem = inventoryItem || {
    id: `inv-${product.id}`,
    productId: product.id,
    warehouseId: 'wh-main-gikondo',
    onHandCrates: 487,
    reservedCrates: 45,
    availableCrates: 442,
    damagedCrates: 1,
    dailyAverageSalesCrates: 59,
    minLevelCrates: 150,
    maxLevelCrates: 650,
    reorderPointCrates: 250,
    stockCoverDays: 8.2,
    batchNumber: 'BRAL-KGL-240902-CH',
    expiryDate: '2026-09-02',
    status: 'healthy'
  };

  // Category Badge Label & Icon
  const getCategoryBadgeLabel = () => {
    switch (product.category) {
      case 'Malt & Energy':
        return 'Energy Drink';
      case 'Beer':
        return 'Beer';
      case 'Premium':
        return 'Premium Beer';
      case 'Soft Drinks':
        return 'Soft Drink';
      case 'Water':
        return 'Mineral Water';
      default:
        return product.category;
    }
  };

  // Demand Tag (Matches the top-right pill)
  const getDemandTag = () => {
    if (product.brand.toLowerCase().includes('cheetah')) return 'High Demand';
    if (item.dailyAverageSalesCrates >= 200) return 'High Demand';
    if (item.dailyAverageSalesCrates >= 100) return 'Fast Moving';
    if (item.onHandCrates > 1500) return 'Top Seller';
    if (item.status === 'low_stock' || item.status === 'critical') return 'High Demand';
    return 'Active Stock';
  };

  // Stock status pill styling with glowing dark glass tokens
  const getStatusBadge = () => {
    switch (item.status) {
      case 'healthy':
        return {
          label: 'HEALTHY',
          dotColor: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.15)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          textColor: '#34D399'
        };
      case 'low_stock':
        return {
          label: 'LOW STOCK',
          dotColor: '#F59E0B',
          bgColor: 'rgba(245, 158, 11, 0.15)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          textColor: '#FBBF24'
        };
      case 'critical':
        return {
          label: 'CRITICAL',
          dotColor: '#EF4444',
          bgColor: 'rgba(239, 68, 68, 0.15)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          textColor: '#F87171'
        };
      case 'overstock':
        return {
          label: 'OVERSTOCK',
          dotColor: '#38BDF8',
          bgColor: 'rgba(56, 189, 248, 0.15)',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          textColor: '#7DD3FC'
        };
    }
  };

  const statusInfo = getStatusBadge();
  const categoryLabel = getCategoryBadgeLabel();

  // Capacity fill percentage for progress bar
  const maxCap = item.maxLevelCrates || 1000;
  const fillPct = Math.min(100, Math.max(12, Math.round((item.onHandCrates / maxCap) * 100)));

  // Days remaining text
  const daysText = `${item.stockCoverDays.toFixed(1)} days runway`;

  // Subtitle (e.g. "Malt Based • 300 ml", "RGB Glass • 500 ml")
  const getSubtitle = () => {
    if (product.brand.toLowerCase().includes('cheetah')) {
      return 'Malt Based • 300 ml';
    }
    if (product.category === 'Soft Drinks') {
      return `RGB Glass • ${product.bottleVolume}`;
    }
    if (product.category === 'Water') {
      return `Mineral Water • ${product.bottleVolume}`;
    }
    if (product.category === 'Beer' || product.category === 'Premium') {
      return `Lager Beer • ${product.bottleVolume}`;
    }
    return `${product.packaging.split(' ')[0]} • ${product.bottleVolume}`;
  };

  return (
    <div
      style={{
        backgroundColor: 'rgba(10, 25, 56, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.24s ease, border-color 0.24s ease',
        cursor: 'default',
        position: 'relative'
      }}
      className="product-stock-card hover-lift"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP HERO BOTTLE CONTAINER (With 100% Unedited Pristine Image)
          ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          height: '290px',
          background: 'radial-gradient(circle at 50% 55%, rgba(255, 255, 255, 0.08) 0%, rgba(6, 16, 38, 0.6) 80%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px 10px 20px',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Floating Demand Badge Top-Right */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '999px',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            zIndex: 4,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <Zap size={12} fill="#FACC15" color="#FACC15" />
          <span>{getDemandTag()}</span>
        </div>

        {/* Product Image - Completely Pure, Zero CSS Edits */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 2,
              position: 'relative'
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              height: '80%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              zIndex: 2
            }}
          >
            <Boxes size={64} />
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. BOTTOM CARD DETAILS CONTAINER
          ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'rgba(6, 16, 38, 0.75)',
          padding: '18px 22px 22px 22px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 3,
          flex: 1
        }}
      >
        {/* Category Pill with ⚡ lightning icon */}
        <div style={{ marginBottom: '10px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(22, 163, 106, 0.16)',
              border: '1px solid rgba(22, 163, 106, 0.32)',
              color: '#34D399',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.02em'
            }}
          >
            <Zap size={11} fill="#34D399" color="#34D399" />
            <span>{categoryLabel}</span>
          </div>
        </div>

        {/* Product Title */}
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 4px 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Subtitle / Volume */}
        <div
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#94A3B8',
            marginBottom: '16px'
          }}
        >
          {getSubtitle()}
        </div>

        {/* Stock Stat Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
            minHeight: '44px'
          }}
        >
          {/* Left: 3D Box Icon & Stock Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 0 auto' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(22, 163, 106, 0.2)',
                border: '1px solid rgba(22, 163, 106, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Boxes size={19} color="#34D399" strokeWidth={2.4} />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span
                style={{
                  fontSize: '26px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  lineHeight: 1
                }}
                className="tabular-nums"
              >
                {item.onHandCrates.toLocaleString()}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#94A3B8'
                }}
              >
                Crates
              </span>
            </div>
          </div>

          {/* Hairline Vertical Divider */}
          <div
            style={{
              width: '1px',
              height: '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              margin: '0 16px',
              flexShrink: 0
            }}
          />

          {/* Right: Status Pill & Days Remaining */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: statusInfo.bgColor,
                  border: `1px solid ${statusInfo.borderColor}`,
                  color: statusInfo.textColor,
                  fontSize: '10.5px',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: statusInfo.dotColor
                  }}
                />
                {statusInfo.label}
              </span>
            </div>
            <span
              style={{
                fontSize: '11.5px',
                color: '#CBD5E1',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {daysText}
            </span>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '18px'
          }}
        >
          <div
            style={{
              flex: 1,
              height: '7px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: `${fillPct}%`,
                height: '100%',
                borderRadius: '999px',
                background:
                  item.status === 'critical'
                    ? 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)'
                    : item.status === 'low_stock'
                    ? 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)'
                    : 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                boxShadow: item.status === 'critical' ? '0 0 8px rgba(239, 68, 68, 0.5)' : '0 0 8px rgba(16, 185, 129, 0.4)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#94A3B8',
              minWidth: '32px',
              textAlign: 'right'
            }}
            className="tabular-nums"
          >
            {fillPct}%
          </span>
        </div>

        {/* Action Button: Glossy forest emerald button */}
        <button
          onClick={() => onViewDetails(product, item)}
          style={{
            width: '100%',
            padding: '11px 18px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            background: 'linear-gradient(180deg, #16A36A 0%, #0D6942 100%)',
            boxShadow: '0 8px 20px rgba(13, 105, 66, 0.35)',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.18s ease'
          }}
          className="stock-details-btn"
        >
          <span>View Details & Batch</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default ProductStockCard;
