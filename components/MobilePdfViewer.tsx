import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useVirtualizer } from "@tanstack/react-virtual";

// Use local worker file - only on client-side
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

type Props = {
  /** Your PDF URL (can be /api/proxy?cid=... if token-gated) */
  fileUrl: string;
  /** initial zoom, default 1 */
  initialScale?: number;
  /** make text selectable (slower on mobile) */
  enableTextLayer?: boolean;
};

export default function MobilePdfViewer({
  fileUrl,
  initialScale = 1,
  enableTextLayer = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [autoFit, setAutoFit] = useState(true);
  const [displayScale, setDisplayScale] = useState(1);

  // Virtualize one row per page
  const rowVirtualizer = useVirtualizer({
    count: Math.max(numPages, 1),
    getScrollElement: () => containerRef.current,
    estimateSize: () => 900, // rough page height; tweak per your docs
    overscan: 2,
  });

  const pages = rowVirtualizer.getVirtualItems();

  const onLoadSuccess = ({ numPages: n }: { numPages: number }) => setNumPages(n);

  const onLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    console.error('PDF file URL:', fileUrl);
    console.error('User agent:', navigator.userAgent);
  };

  // Calculate optimal scale to fit container width
  const calculateOptimalScale = useCallback(() => {
    if (!containerRef.current || !autoFit) return scale;
    
    const containerWidth = containerRef.current.offsetWidth;
    const padding = 20; // Account for padding
    const availableWidth = containerWidth - padding;
    
    // Standard PDF page width is 612 points (8.5 inches at 72 DPI)
    const pdfPageWidth = 612;
    const optimalScale = availableWidth / pdfPageWidth;
    
    // Clamp between reasonable bounds
    return Math.max(0.5, Math.min(2.0, optimalScale));
  }, [autoFit, scale]);

  // Update scale when container size changes
  useEffect(() => {
    if (autoFit) {
      const optimalScale = calculateOptimalScale();
      setScale(optimalScale);
      setDisplayScale(1); // Always show 100% when auto-fit is active
    }
  }, [autoFit, calculateOptimalScale]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (autoFit) {
        const optimalScale = calculateOptimalScale();
        setScale(optimalScale);
        setDisplayScale(1); // Always show 100% when auto-fit is active
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [autoFit, calculateOptimalScale]);

  // Memoize options to prevent unnecessary reloads
  const pdfOptions = useMemo(() => ({
    standardFontDataUrl: undefined,
    disableFontFace: false,
    disableRange: false,
    disableStream: false,
    disableAutoFetch: false,
    disableCreateObjectURL: false
  }), []);

  // Keep canvas crisp without blowing up iOS memory
  const deviceScale = useMemo(() => {
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    // Use a more conservative scaling approach for better fit
    return Math.min(1.5, dpr) * scale; // cap high DPR to 1.5x instead of 2x
  }, [scale]);

  return (
    <div className="pdfWrap">
      <div className="toolbar">
        <button
          onClick={() => {
            setAutoFit(false);
            const newScale = Math.max(0.5, +(scale - 0.1).toFixed(2));
            setScale(newScale);
            setDisplayScale(newScale);
          }}
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="zoom">{Math.round(displayScale * 100)}%</span>
        <button
          onClick={() => {
            setAutoFit(false);
            const newScale = Math.min(3.0, +(scale + 0.1).toFixed(2));
            setScale(newScale);
            setDisplayScale(newScale);
          }}
          aria-label="Zoom in"
        >
          +
        </button>
        <a className="open" href={fileUrl} target="_blank" rel="noreferrer">
          Open in system viewer
        </a>
      </div>

      <div ref={containerRef} className="viewport">
        <Document
          file={fileUrl}
          onLoadSuccess={onLoadSuccess}
          loading={<div className="loading">Loading PDF…</div>}
          // smaller bundle; react-pdf will use built-in fonts
          options={pdfOptions}
        >
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              width: "100%",
              position: "relative",
            }}
          >
            {pages.map((v) => (
              <div
                key={v.key}
                data-index={v.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${v.start}px)`,
                  willChange: "transform",
                }}
              >
                <Page
                  pageNumber={v.index + 1}
                  scale={scale}
                  renderTextLayer={enableTextLayer}
                  renderAnnotationLayer={false}
                  // Keep memory usage in check on mobile
                  onRenderSuccess={(p) => p?.cleanup?.()}
                />
              </div>
            ))}
          </div>
        </Document>
      </div>

      <style jsx>{`
        .pdfWrap {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #fff;
        }
        .toolbar {
          position: sticky;
          top: 0;
          z-index: 2;
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 10px 12px;
          border-bottom: 1px solid #eee;
          background: #fff;
        }
        .toolbar button {
          font-size: 18px;
          line-height: 1;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background: #fafafa;
        }
        .zoom {
          min-width: 48px;
          text-align: center;
        }
        .open {
          margin-left: auto;
          text-decoration: underline;
          font-size: 14px;
        }
        .viewport {
          flex: 1 1 auto;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          background: #f8f9fb;
        }
        .viewport :global(.react-pdf__Page) {
          max-width: 100% !important;
          height: auto !important;
        }
        .viewport :global(.react-pdf__Page__canvas) {
          max-width: 100% !important;
          height: auto !important;
        }
        .loading {
          padding: 24px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
