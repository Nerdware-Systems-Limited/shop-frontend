import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { Title, Meta, Link as HeadLink } from 'react-head';
import { listInstallationJobs } from '../actions/Installationactions';
import { ChevronLeft, ChevronRight, Search, X, SlidersHorizontal, Wrench, Car } from 'lucide-react';

// ─── SEO Component ────────────────────────────────────────────────────────────
const InstallationsSEO = ({ count }) => {
  const title = 'Car Audio Installation Gallery — Sound Wave Audio Nairobi';
  const description = `Browse ${count || 'our'} professional car audio installation jobs by Sound Wave Audio Nairobi. Android radios, subwoofers, amplifiers, 360 cameras & full audio upgrades. See real results on Toyota, Mitsubishi, Subaru & more.`;
  const canonical = 'https://soundwaveaudio.co.ke/installations';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Sound Wave Audio',
      url: 'https://soundwaveaudio.co.ke',
      address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
    },
  };

  return (
    <>
      <Title>{title}</Title>
      <Meta name="description" content={description} />
      <Meta name="keywords" content="car audio installation nairobi, android radio installation, subwoofer installation kenya, 360 camera install, amplifier installation nairobi, toyota audio upgrade, mitsubishi audio upgrade" />
      <Meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <Meta property="og:title" content={title} />
      <Meta property="og:description" content={description} />
      <Meta property="og:url" content={canonical} />
      <Meta property="og:type" content="website" />
      <Meta property="og:site_name" content="Sound Wave Audio" />
      <Meta property="og:locale" content="en_KE" />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={title} />
      <Meta name="twitter:description" content={description} />
      <HeadLink rel="canonical" href={canonical} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
};

// ─── Job Card ─────────────────────────────────────────────────────────────────
const JobCard = ({ job, index }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const img = job.primary_after_image;

  // Build vehicle info from API data
  const vehicleInfo = [
    job.vehicle_make_name,
    job.vehicle_model,
    job.vehicle_year
  ].filter(Boolean).join(' · ');

  return (
    <Link
      to={`/installations/${job.slug}`}
      className="group block relative overflow-hidden bg-white"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {img ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            <img
              src={img.image}
              alt={img.alt_text || job.display_title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Car className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Featured badge */}
        {job.is_featured && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase tracking-[0.2em] px-2 py-1">
            Featured
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        {/* View label */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white text-black text-xs uppercase tracking-[0.2em] px-4 py-2">
            View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">
          {vehicleInfo || 'Installation'}
        </p>
        <h3 className="text-sm font-light tracking-wide leading-snug line-clamp-2 group-hover:opacity-60 transition-opacity">
          {job.display_title}
        </h3>
        {job.description && (
          <p className="mt-2 text-[11px] text-gray-500 leading-relaxed line-clamp-2">
            {job.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-gray-400">
            {new Date(job.job_date).toLocaleDateString('en-KE', { year: 'numeric', month: 'short' })}
          </span>
          <span className="text-[10px] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
            View <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="overflow-hidden">
    <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-2 w-16 bg-gray-200 animate-pulse" />
      <div className="h-3 w-full bg-gray-200 animate-pulse" />
      <div className="h-3 w-4/5 bg-gray-200 animate-pulse" />
      <div className="h-2 w-24 bg-gray-200 animate-pulse mt-3" />
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Installations = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { jobs, loading, error, count, next, previous } = useSelector(
    (state) => state.installationJobList
  );

  // Local state
  const [search, setSearch]         = useState(searchParams.get('search') || '');
  const [make, setMake]             = useState(searchParams.get('make') || '');
  const [ordering, setOrdering]     = useState('-job_date');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef(null);

  // Build & fire query
  const buildParams = ({ overrides = {} } = {}) => ({
    search:   search,
    make:     make,
    ordering: ordering,
    page:     currentPage,
    ...overrides,
  });

  useEffect(() => {
    dispatch(listInstallationJobs(buildParams()));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, make, ordering, currentPage]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(listInstallationJobs(buildParams()));
    }, 380);
    return () => clearTimeout(t);
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleMake = (slug) => {
    setMake(prev => prev === slug ? '' : slug);
    setCurrentPage(1);
  };

  const handleOrdering = (val) => {
    setOrdering(val);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearch('');
    setMake('');
    setOrdering('-job_date');
    setCurrentPage(1);
  };

  const handlePageChange = (url, direction) => {
    if (!url) return;
    setCurrentPage(prev => direction === 'next' ? prev + 1 : prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get job list from Redux store
  const jobList = Array.isArray(jobs) ? jobs : [];

  // Dynamically extract unique vehicle makes from API data
  const uniqueMakes = [...new Set(jobList
    .map(job => job.vehicle_make_name)
    .filter(Boolean)
  )].sort();

  // Build make options from API data
  const makeOptions = uniqueMakes.map(make => ({
    slug: make.toLowerCase(),
    label: make
  }));

  const sortOptions = [
    { value: '-job_date', label: 'Newest First' },
    { value: 'job_date',  label: 'Oldest First' },
    { value: 'vehicle_model', label: 'Vehicle Model' },
  ];

  const hasActiveFilters = search || make;

  return (
    <div className="min-h-screen">
      <InstallationsSEO count={count} />

      {/* ── Page Header ── */}
      <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1 flex items-center gap-2">
                <Wrench className="w-3 h-3" /> Our Work
              </p>
              <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase">
                Installations
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {loading ? '—' : `${count ?? jobList.length} jobs completed`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="hidden md:block">
                <select
                  value={ordering}
                  onChange={(e) => handleOrdering(e.target.value)}
                  className="px-3 py-2 text-xs border border-black focus:outline-none bg-white uppercase tracking-wider"
                >
                  {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen(v => !v)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-4 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search by vehicle, upgrade type…"
              value={search}
              onChange={handleSearch}
              className="w-full pl-9 pr-8 py-2.5 text-xs border border-black focus:outline-none focus:border-gray-500 tracking-wide"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-black" />
              </button>
            )}
          </div>

          {/* Mobile sort */}
          <div className="md:hidden mt-3">
            <select
              value={ordering}
              onChange={(e) => handleOrdering(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-black focus:outline-none bg-white"
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-36 space-y-8">
              {/* Make filter */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-3">
                  Vehicle Make
                </p>
                <div className="space-y-1">
                  {/* All Makes option */}
                  <button
                    onClick={() => handleMake('')}
                    className={`w-full text-left text-xs px-3 py-2 transition-colors tracking-wide border ${
                      !make
                        ? 'border-black bg-black text-white'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    All Makes
                  </button>
                  {/* Dynamic makes from API */}
                  {makeOptions.map(m => (
                    <button
                      key={m.slug}
                      onClick={() => handleMake(m.slug)}
                      className={`w-full text-left text-xs px-3 py-2 transition-colors tracking-wide border ${
                        make === m.slug
                          ? 'border-black bg-black text-white'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={handleClear}
                  className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* ── Grid ── */}
          <main className="flex-1 min-w-0">
            {/* Active filter pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {search && (
                  <span className="flex items-center gap-1 text-[11px] border border-black px-3 py-1">
                    "{search}"
                    <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {make && (
                  <span className="flex items-center gap-1 text-[11px] border border-black px-3 py-1">
                    {makeOptions.find(m => m.slug === make)?.label || make}
                    <button onClick={() => setMake('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="border border-gray-200 p-6 text-center text-xs text-gray-600 tracking-wider">
                Failed to load installations. Please try again.
              </div>
            )}

            {/* Grid */}
            {!error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-white">
                        <SkeletonCard />
                      </div>
                    ))
                  : jobList.length > 0
                    ? jobList.map((job, i) => (
                        <div key={job.id} className="bg-white">
                          <JobCard job={job} index={i} />
                        </div>
                      ))
                    : (
                      <div className="col-span-full py-24 text-center">
                        <Car className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                        <p className="text-sm uppercase tracking-[0.2em] text-gray-400">No installations found</p>
                        {hasActiveFilters && (
                          <button onClick={handleClear} className="mt-4 text-xs underline tracking-wider text-gray-500 hover:text-black">
                            Clear filters
                          </button>
                        )}
                      </div>
                    )
                }
              </div>
            )}

            {/* ── Pagination ── */}
            {!loading && !error && jobList.length > 0 && (previous || next) && (
              <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
                <button
                  onClick={() => handlePageChange(previous, 'prev')}
                  disabled={!previous}
                  className={`flex items-center gap-2 px-4 py-2 text-xs border transition-colors uppercase tracking-widest ${
                    previous
                      ? 'border-black hover:bg-black hover:text-white cursor-pointer'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <span className="text-xs text-gray-500">
                  Page <strong>{currentPage}</strong>
                  {count && <span className="ml-2">· {jobList.length} of {count}</span>}
                </span>

                <button
                  onClick={() => handlePageChange(next, 'next')}
                  disabled={!next}
                  className={`flex items-center gap-2 px-4 py-2 text-xs border transition-colors uppercase tracking-widest ${
                    next
                      ? 'border-black hover:bg-black hover:text-white cursor-pointer'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Filter Overlay ── */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <span className="text-xs uppercase tracking-[0.25em]">Filters</span>
              <button onClick={() => setFiltersOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-3">Vehicle Make</p>
                <div className="space-y-1">
                  {/* All Makes option */}
                  <button
                    onClick={() => { handleMake(''); setFiltersOpen(false); }}
                    className={`w-full text-left text-xs px-3 py-2.5 border transition-colors tracking-wide ${
                      !make
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    All Makes
                  </button>
                  {/* Dynamic makes from API */}
                  {makeOptions.map(m => (
                    <button
                      key={m.slug}
                      onClick={() => { handleMake(m.slug); setFiltersOpen(false); }}
                      className={`w-full text-left text-xs px-3 py-2.5 border transition-colors tracking-wide ${
                        make === m.slug
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-black'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {hasActiveFilters && (
              <div className="px-5 py-4 border-t border-gray-200">
                <button
                  onClick={() => { handleClear(); setFiltersOpen(false); }}
                  className="w-full py-2 text-xs uppercase tracking-widest border border-black hover:bg-black hover:text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CTA Banner ── */}
      <section className="border-t border-gray-800 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-6">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400">
            Ready for an upgrade?
          </p>
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase">
            Book Your Installation
          </h2>
          <p className="text-xs tracking-widest text-gray-400 max-w-md mx-auto leading-relaxed">
            Professional car audio installation in Nairobi. Android radios, subwoofers, amplifiers, 360 cameras and more.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-black text-xs uppercase tracking-[0.2em] px-8 py-3 hover:bg-gray-100 transition-colors"
          >
            Get a Quote <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Installations;