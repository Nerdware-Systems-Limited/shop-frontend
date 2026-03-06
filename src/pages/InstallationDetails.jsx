import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Title, Meta, Link as HeadLink } from 'react-head';
import {
  getInstallationJobDetails,
  resetInstallationJobDetails,
} from '../actions/Installationactions';
import {
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Wrench,
  Car,
  Calendar,
  User,
  Package,
  X,
  Play,
  ZoomIn,
} from 'lucide-react';

// ─── SEO ──────────────────────────────────────────────────────────────────────
const InstallationDetailSEO = ({ job }) => {
  if (!job?.id) return null;

  const title = job.meta_title + " — Sound Wave Audio Nairobi" || job.title;
  const description =
    job.meta_description ||
    job.description ||
    `Professional car audio installation on a ${job.display_title} by Sound Wave Audio Nairobi.`;
  const canonical = `https://soundwaveaudio.co.ke/installations/${job.slug}`;
  const ogImage =
    job.effective_og_image ||
    job.primary_after_image?.image ||
    'https://soundwaveaudio.co.ke/og-image.jpg';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url: canonical,
    image: ogImage,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Sound Wave Audio',
      url: 'https://soundwaveaudio.co.ke',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
    },
    ...(job.job_date && { datePublished: job.job_date }),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://soundwaveaudio.co.ke/' },
      { '@type': 'ListItem', position: 2, name: 'Installations', item: 'https://soundwaveaudio.co.ke/installations' },
      { '@type': 'ListItem', position: 3, name: title, item: canonical },
    ],
  };

  return (
    <>
      <Title>{title}</Title>
      <Meta name="description" content={description} />
      {job.seo_keywords && <Meta name="keywords" content={job.seo_keywords} />}
      <Meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <Meta property="og:title" content={title} />
      <Meta property="og:description" content={description} />
      <Meta property="og:url" content={canonical} />
      <Meta property="og:image" content={ogImage} />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta property="og:type" content="article" />
      <Meta property="og:site_name" content="Sound Wave Audio" />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={title} />
      <Meta name="twitter:description" content={description} />
      <Meta name="twitter:image" content={ogImage} />
      <HeadLink rel="canonical" href={canonical} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
};

// ─── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent(i => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft') setCurrent(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  const img = images[current];

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-[0.2em] uppercase">
        {current + 1} / {images.length}
      </div>

      {/* Prev */}
      {current > 0 && (
        <button
          onClick={() => setCurrent(i => i - 1)}
          className="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Image */}
      <div className="max-w-5xl max-h-[85vh] mx-16">
        <img
          src={img.image}
          alt={img.alt_text}
          className="max-w-full max-h-[80vh] object-contain"
        />
        {img.caption && (
          <p className="text-center text-white/50 text-xs mt-3 tracking-wider">{img.caption}</p>
        )}
      </div>

      {/* Next */}
      {current < images.length - 1 && (
        <button
          onClick={() => setCurrent(i => i + 1)}
          className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4">
        {images.map((im, i) => (
          <button
            key={im.id}
            onClick={() => setCurrent(i)}
            className={`flex-shrink-0 w-14 h-10 overflow-hidden border-2 transition-colors ${
              i === current ? 'border-white' : 'border-white/20 hover:border-white/50'
            }`}
          >
            <img src={im.image} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Image Gallery Section ────────────────────────────────────────────────────
const ImageGallery = ({ title, images, badge }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  if (!images?.length) return null;

  const primary = images[0];
  const rest = images.slice(1);

  return (
    <div>
      {title && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">{title}</span>
          {badge && (
            <span className="text-[10px] uppercase tracking-wider border border-gray-300 px-2 py-0.5">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Primary large image */}
      <div
        className="relative aspect-[16/10] overflow-hidden bg-gray-100 rounded-lg cursor-zoom-in group"
        onClick={() => setLightboxIndex(0)}
      >
        <img
          src={primary.image}
          alt={primary.alt_text}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {primary.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[11px] px-4 py-2 tracking-wide">
            {primary.caption}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {rest.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {rest.map((img, i) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg cursor-zoom-in group"
              onClick={() => setLightboxIndex(i + 1)}
            >
              <img
                src={img.image}
                alt={img.alt_text}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
};

// ─── Video Embed ──────────────────────────────────────────────────────────────
const VideoCard = ({ video }) => {
  const [playing, setPlaying] = useState(false);

  if (video.video_file && !video.embed_code) {
    return (
      <div className="border border-black overflow-hidden">
        <video controls className="w-full aspect-video bg-black">
          <source src={video.video_file} />
        </video>
        {video.title && (
          <div className="px-4 py-3 border-t border-black">
            <p className="text-xs tracking-wide">{video.title}</p>
          </div>
        )}
      </div>
    );
  }

  if (video.embed_code) {
    return (
      <div className="border border-black overflow-hidden">
        {playing ? (
          <iframe
            src={`${video.embed_code}?autoplay=1`}
            className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className="relative aspect-video bg-black cursor-pointer group"
            onClick={() => setPlaying(true)}
          >
            {video.auto_thumbnail_url ? (
              <img
                src={video.auto_thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
              />
            ) : (
              <div className="w-full h-full bg-gray-900" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-black ml-1" />
              </div>
            </div>
          </div>
        )}
        {video.title && (
          <div className="px-4 py-3 border-t border-black">
            <p className="text-xs tracking-wide">{video.title}</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-0.5">
              {video.video_type_display}
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
    <div className="h-3 w-40 bg-gray-200 mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="aspect-[16/10] bg-gray-100" />
        <div className="grid grid-cols-4 gap-px bg-black border border-black">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-3 w-24 bg-gray-200" />
        <div className="h-6 w-full bg-gray-200" />
        <div className="h-6 w-4/5 bg-gray-200" />
        <div className="h-3 w-full bg-gray-100 mt-4" />
        <div className="h-3 w-5/6 bg-gray-100" />
        <div className="h-3 w-full bg-gray-100" />
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const InstallationDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { job, loading, error } = useSelector((state) => state.installationJobDetails);

  useEffect(() => {
    if (slug) dispatch(getInstallationJobDetails(slug));
    window.scrollTo({ top: 0 });
    return () => dispatch(resetInstallationJobDetails());
  }, [dispatch, slug]);

  // ── Derived data ──
  const afterImages  = job?.after_images  || [];
  const beforeImages = job?.before_images || [];
  const inProgImages = job?.in_progress_images || [];
  const allImages    = [...afterImages, ...beforeImages, ...inProgImages];
  const items        = job?.installed_items || [];
  const videos       = job?.videos || [];

  // Group items by category_display
  const itemsByCategory = items.reduce((acc, item) => {
    const cat = item.category_display || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen">
      <DetailSkeleton />
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <Car className="w-12 h-12 text-gray-200" />
      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Installation not found</p>
      <Link
        to="/installations"
        className="text-xs uppercase tracking-widest border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors"
      >
        Back to Installations
      </Link>
    </div>
  );

  if (!job?.id) return null;

  const vehicleLabel = [
    job.vehicle_make?.name,
    job.vehicle_model,
    job.vehicle_year,
  ].filter(Boolean).join(' · ');

  return (
    <div className="min-h-screen">
      <InstallationDetailSEO job={job} />

      {/* ── Breadcrumb ── */}
      <div className="border-b border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link to="/installations" className="hover:text-black transition-colors">Installations</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-black truncate max-w-[200px]">{job.display_title}</span>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Back link — mobile */}
        <button
          onClick={() => navigate(-1)}
          className="lg:hidden flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">

          {/* ── Left / Media ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* After images (primary gallery) */}
            {afterImages.length > 0 && (
              <ImageGallery title="After Installation" images={afterImages} />
            )}

            {/* Before images */}
            {beforeImages.length > 0 && (
              <ImageGallery title="Before" images={beforeImages} />
            )}

            {/* In-progress images */}
            {inProgImages.length > 0 && (
              <ImageGallery title="In Progress" images={inProgImages} />
            )}

            {/* Fallback if no grouped images but primary exists */}
            {allImages.length === 0 && job.primary_after_image && (
              <div className="relative aspect-[16/10] overflow-hidden border border-black bg-gray-100">
                <img
                  src={job.primary_after_image.image}
                  alt={job.primary_after_image.alt_text}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-4">Videos</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videos.map(v => <VideoCard key={v.id} video={v} />)}
                </div>
              </div>
            )}

            {/* Installed Items — desktop shows below gallery */}
            {items.length > 0 && (
              <div className="border border-black">
                <div className="px-5 py-4 border-b border-black flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" />
                  <p className="text-xs uppercase tracking-[0.2em]">Installed Components</p>
                  <span className="ml-auto text-[10px] text-gray-500">{items.length} items</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {Object.entries(itemsByCategory).map(([cat, catItems]) => (
                    <div key={cat}>
                      <div className="px-5 py-2 bg-gray-50">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{cat}</p>
                      </div>
                      {catItems.map(item => (
                        <div key={item.id} className="px-5 py-3 flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs tracking-wide">
                              {item.name}
                              {item.quantity > 1 && (
                                <span className="ml-2 text-[10px] text-gray-500">×{item.quantity}</span>
                              )}
                            </p>
                            {item.notes && (
                              <p className="text-[11px] text-gray-500 mt-0.5">{item.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right / Info Sidebar ── */}
          <div className="space-y-6">

            {/* Job title & meta */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2 flex items-center gap-2">
                <Wrench className="w-3 h-3" />
                {vehicleLabel || 'Installation'}
              </p>
              <h1 className="text-xl md:text-2xl font-light tracking-[0.05em] leading-snug">
                {job.display_title}
              </h1>
              {job.is_featured && (
                <span className="inline-block mt-2 text-[10px] uppercase tracking-[0.2em] border border-black px-2 py-0.5">
                  Featured
                </span>
              )}
            </div>

            {/* Description */}
            {job.description && (
              <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {job.description}
              </p>
            )}

            {/* Job details card */}
            <div className="border border-black divide-y divide-gray-100">
              {job.vehicle_make?.name && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <Car className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Vehicle</p>
                    <p className="text-xs mt-0.5">
                      {[job.vehicle_make.name, job.vehicle_model, job.vehicle_year].filter(Boolean).join(' ')}
                    </p>
                  </div>
                </div>
              )}

              {job.job_date && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Date</p>
                    <p className="text-xs mt-0.5">
                      {new Date(job.job_date).toLocaleDateString('en-KE', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}

              {job.technician && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Technician</p>
                    <p className="text-xs mt-0.5">{job.technician}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 px-4 py-3">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  job.status === 'completed' ? 'bg-green-500' :
                  job.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Status</p>
                  <p className="text-xs mt-0.5">{job.status_display}</p>
                </div>
              </div>
            </div>

            {/* Component count summary */}
            {items.length > 0 && (
              <div className="border border-black px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Components</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(itemsByCategory).map(([cat, catItems]) => (
                    <span
                      key={cat}
                      className="text-[10px] uppercase tracking-wider bg-gray-100 px-2 py-1"
                    >
                      {catItems.length}× {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="border border-black p-5 space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] mb-1">Want this for your car?</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Get a professional installation quote from Sound Wave Audio Nairobi.
              </p>
              <Link
                to="/contact"
                className="block w-full text-center bg-black text-white text-xs uppercase tracking-[0.2em] py-3 hover:bg-gray-800 transition-colors"
              >
                Get a Quote
              </Link>
              <Link
                to="/products"
                className="block w-full text-center border border-black text-xs uppercase tracking-[0.2em] py-3 hover:bg-black hover:text-white transition-colors"
              >
                Shop Products
              </Link>
            </div>

            {/* Back to gallery */}
            <Link
              to="/installations"
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Installations
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-black bg-black text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center space-y-5">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">Sound Wave Audio</p>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase">
            Professional Car Audio Installation
          </h2>
          <p className="text-xs tracking-widest text-gray-400 max-w-md mx-auto leading-relaxed">
            Android radios, subwoofers, amplifiers, 360 cameras and full system upgrades — Nairobi's trusted specialists.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="bg-white text-black text-xs uppercase tracking-[0.2em] px-8 py-3 hover:bg-gray-100 transition-colors"
            >
              Book an Appointment
            </Link>
            <Link
              to="/installations"
              className="border border-white/30 text-white text-xs uppercase tracking-[0.2em] px-8 py-3 hover:border-white transition-colors"
            >
              View More Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InstallationDetails;