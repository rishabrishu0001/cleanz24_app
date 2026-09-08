import React, { useState, useEffect } from "react";
import {
  X, Search, Plus, Home as HomeIcon,
  Building2, MapPin, ChevronRight, Check, Loader2,
  Navigation, AlertCircle, CheckCircle
} from "lucide-react";

export default function LocationPickerModal({ currentLocation, onSelectLocation, onClose }) {
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: 28.5445, lng: 77.3292 });
  const [pendingLabel, setPendingLabel] = useState("");
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [addForm, setAddForm] = useState({ title: "Home", address: "", phone: "" });
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSearchResults, setMapSearchResults] = useState([]);
  const [isMapSearching, setIsMapSearching] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: "work_94", type: "Work", title: "Work", badge: "Frequently used",
      address: "2735, 27th floor super astilis, Sector 94, Noida",
      phone: "9310590680", lat: 28.5445, lng: 77.3292, icon: "work"
    },
    {
      id: "home_41", type: "Home", title: "Home", badge: "Frequently used",
      address: "Gali no. 12 baba surdas, Sector 41, Noida",
      phone: "9138004800", lat: 28.5638, lng: 77.3627, icon: "home"
    }
  ]);

  const formatAddress = (addr, displayName) => {
    addr = addr || {};
    displayName = displayName || "";
    const preciseText = [addr.quarter, addr.suburb, addr.neighbourhood, addr.residential, addr.road]
      .filter(Boolean).join(" ");
    const sectorMatch = preciseText.match(/Sector\s*\d+[A-Za-z]?/i);
    const sector = sectorMatch ? sectorMatch[0] : null;
    let area = sector || addr.quarter || addr.suburb || addr.neighbourhood
      || addr.residential || addr.road || addr.village || "";
    area = area.replace(/\bDadri\b|\bTehsil\b/gi, "").replace(/^,|,$/g, "").trim();
    if (!area) area = displayName.split(",")[0].trim();
    let city = addr.city || addr.town || addr.county || addr.state_district || "";
    city = city.replace(/\bDadri\b/gi, "").trim();
    if (!city) {
      const hits = ["Noida", "Greater Noida", "Delhi", "Gurgaon", "Ghaziabad", "Faridabad", "Mumbai", "Bangalore"];
      city = hits.find(c => displayName.includes(c)) || "";
    }
    return city ? (area + ", " + city) : (area || displayName.split(",").slice(0, 2).join(",").trim());
  };

  // Debounced main search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(searchQuery + ", India") + "&format=json&addressdetails=1&limit=6",
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        setSearchResults(data || []);
      } catch { setSearchResults([]); }
      finally { setIsSearching(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounced map confirmation search
  useEffect(() => {
    if (!mapSearchQuery.trim() || mapSearchQuery.length < 2) { setMapSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setIsMapSearching(true);
      try {
        const res = await fetch(
          "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(mapSearchQuery + ", India") + "&format=json&addressdetails=1&limit=5",
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        setMapSearchResults(data || []);
      } catch { setMapSearchResults([]); }
      finally { setIsMapSearching(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [mapSearchQuery]);

  const reverseGeocode = async (lat, lng) => {
    const res = await fetch(
      "https://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + lng + "&format=json&addressdetails=1",
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return formatAddress(data.address, data.display_name);
  };

  const [autoFocusCorrection, setAutoFocusCorrection] = useState(false);

  const handleGPS = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude, lng = pos.coords.longitude;
        const acc = pos.coords.accuracy;
        setMapCoords({ lat, lng });
        setGpsAccuracy(acc);
        const isInaccurate = acc > 500;
        try {
          const label = await reverseGeocode(lat, lng);
          setPendingLabel(label);
          setMapSearchQuery("");
          setMapSearchResults([]);
          setAutoFocusCorrection(isInaccurate);
          setView("map");
        } catch {
          setPendingLabel("Near (" + lat.toFixed(4) + ", " + lng.toFixed(4) + ")");
          setAutoFocusCorrection(isInaccurate);
          setView("map");
        } finally { setIsLocatingGPS(false); }
      },
      (err) => {
        setIsLocatingGPS(false);
        if (err.code === 1) alert("Location access denied.\nPlease allow location in browser settings and try again.");
        else alert("Could not detect location. Please search your address manually below.");
      },
      { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  const confirmLocation = () => {
    if (pendingLabel) { onSelectLocation(pendingLabel, mapCoords); onClose(); }
  };

  const selectSaved = (addr) => {
    const label = addr.address.split(",").slice(0, 2).join(",").trim();
    onSelectLocation(label, { lat: addr.lat, lng: addr.lng });
    onClose();
  };

  const selectSearchResult = (item) => {
    const lat = parseFloat(item.lat), lng = parseFloat(item.lon);
    const label = formatAddress(item.address, item.display_name);
    onSelectLocation(label, { lat, lng });
    onClose();
  };

  const selectMapSearchResult = (item) => {
    const lat = parseFloat(item.lat), lng = parseFloat(item.lon);
    const label = formatAddress(item.address, item.display_name);
    setMapCoords({ lat, lng });
    setPendingLabel(label);
    setMapSearchQuery("");
    setMapSearchResults([]);
    setGpsAccuracy(null);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addForm.address.trim()) return;
    const newAddr = {
      id: "addr_" + Date.now(), type: addForm.title, title: addForm.title, badge: "New",
      address: addForm.address, phone: addForm.phone,
      lat: mapCoords.lat, lng: mapCoords.lng,
      icon: addForm.title.toLowerCase() === "home" ? "home" : "work"
    };
    setSavedAddresses(prev => [newAddr, ...prev]);
    selectSaved(newAddr);
  };

  const mapTileUrl = "https://www.openstreetmap.org/export/embed.html?bbox=" +
    (mapCoords.lng - 0.005) + "," + (mapCoords.lat - 0.003) + "," +
    (mapCoords.lng + 0.005) + "," + (mapCoords.lat + 0.003) +
    "&layer=mapnik&marker=" + mapCoords.lat + "," + mapCoords.lng;

  const overlay = {
    position: "fixed", inset: 0, zIndex: 3000,
    background: "rgba(0,0,0,0.6)",
    display: "flex", flexDirection: "column",
    justifyContent: "flex-end", alignItems: "center"
  };
  const sheet = {
    width: "100%", maxWidth: "460px",
    background: "var(--bg-card)", color: "var(--text-main)",
    borderRadius: "24px 24px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.3)",
    display: "flex", flexDirection: "column", maxHeight: "92vh", overflow: "hidden"
  };
  const handle = {
    width: "40px", height: "4px", borderRadius: "2px",
    background: "var(--border-glass)", margin: "12px auto 0", flexShrink: 0
  };
  const rowStyle = {
    display: "flex", alignItems: "center", gap: "14px",
    padding: "14px 16px", cursor: "pointer",
    borderBottom: "1px solid var(--border-glass)"
  };
  const iconBox = (color) => ({
    width: "42px", height: "42px", borderRadius: "12px",
    background: color, display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0
  });
  const btnPrimary = {
    width: "100%", padding: "14px", borderRadius: "14px",
    fontWeight: "800", fontSize: "15px", cursor: "pointer",
    border: "none", background: "linear-gradient(135deg, #16A34A, #22C55E)",
    color: "#FFF", boxShadow: "0 4px 16px rgba(34,197,94,0.35)"
  };

  // MAP CONFIRM VIEW
  if (view === "map") {
    const isLowAccuracy = gpsAccuracy && gpsAccuracy > 500;
    return (
      <div style={overlay} onClick={onClose}>
        <div style={{ ...sheet, maxHeight: "96vh" }} onClick={e => e.stopPropagation()}>
          {/* Map */}
          <div style={{ position: "relative", height: "220px", flexShrink: 0, overflow: "hidden", borderRadius: "24px 24px 0 0", background: "#E8F5E9" }}>
            <iframe title="map" src={mapTileUrl} style={{ width: "100%", height: "100%", border: "none", pointerEvents: "none" }} scrolling="no" />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -100%)", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(22,163,74,0.5)", border: "3px solid #FFF" }}>
                <MapPin size={20} color="#FFF" fill="#FFF" />
              </div>
              <div style={{ width: "2px", height: "12px", background: "#16A34A" }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(22,163,74,0.3)" }} />
            </div>
            <button onClick={() => setView("list")} style={{ position: "absolute", top: "10px", left: "10px", padding: "5px 12px", borderRadius: "20px", background: "#FFF", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "700", color: "#374151", boxShadow: "0 2px 10px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: "4px" }}>
              <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} /> Back
            </button>
            <button onClick={onClose} style={{ position: "absolute", top: "10px", right: "10px", width: "32px", height: "32px", borderRadius: "50%", background: "#FFF", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              <X size={16} color="#374151" />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* GPS Accuracy Warning */}
            {isLowAccuracy && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "12px 14px", background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.3)", borderRadius: "12px" }}>
                <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: "1px" }} />
                <div style={{ fontSize: "12px", color: "#DC2626", fontWeight: "600", lineHeight: 1.5 }}>
                  ⚠️ GPS inaccurate on desktop ({Math.round(gpsAccuracy / 1000) > 0 ? Math.round(gpsAccuracy / 1000) + " km" : Math.round(gpsAccuracy) + " m"} off).<br />
                  <span style={{ fontWeight: "800" }}>Please type your correct location below ↓</span>
                </div>
              </div>
            )}

            {/* Detected Location */}
            <div style={{ background: "var(--bg-card-subtle)", border: "1.5px solid var(--border-glass)", borderRadius: "14px", padding: "12px 14px", display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={iconBox("rgba(22,163,74,0.12)")}><MapPin size={18} color="#16A34A" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "700", marginBottom: "2px", letterSpacing: "0.05em" }}>DELIVERY LOCATION</div>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-main)" }}>{pendingLabel || "Detecting..."}</div>
              </div>
            </div>

            {/* Inline Correction Search */}
            <div style={{ borderRadius: "14px", border: "1.5px solid var(--border-glass)", overflow: "visible", background: "var(--bg-card-subtle)" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", padding: "10px 14px 4px", letterSpacing: "0.05em" }}>NOT YOUR LOCATION? CORRECT IT:</div>
              <div style={{ position: "relative", padding: "0 10px 10px" }}>
                <Search size={14} style={{ position: "absolute", left: "22px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  autoFocus={autoFocusCorrection}
                  placeholder="Type your area, sector, city..."
                  value={mapSearchQuery}
                  onChange={e => setMapSearchQuery(e.target.value)}
                  style={{ width: "100%", padding: "10px 10px 10px 34px", borderRadius: "10px", border: autoFocusCorrection ? "1.5px solid #DC2626" : "1px solid var(--border-glass)", background: "var(--bg-card)", color: "var(--text-main)", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                />
                {isMapSearching && <Loader2 size={13} className="animate-spin" style={{ position: "absolute", right: "22px", top: "50%", transform: "translateY(-50%)", color: "var(--primary-green)" }} />}
              </div>
              {mapSearchResults.length > 0 && (
                <div style={{ borderTop: "1px solid var(--border-glass)", maxHeight: "160px", overflowY: "auto" }}>
                  {mapSearchResults.map((item, i) => {
                    const label = formatAddress(item.address, item.display_name);
                    return (
                      <div key={i} onClick={() => selectMapSearchResult(item)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", cursor: "pointer", borderBottom: i < mapSearchResults.length - 1 ? "1px solid var(--border-glass)" : "none" }}>
                        <MapPin size={14} color="#16A34A" style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-main)" }}>{label}</div>
                          <div style={{ fontSize: "10px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.display_name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button style={btnPrimary} onClick={confirmLocation}>
              Confirm This Location
            </button>
          </div>
        </div>
        <style>{"@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}"}</style>
      </div>
    );
  }

  // SEARCH VIEW
  if (view === "search") {
    return (
      <div style={overlay} onClick={onClose}>
        <div style={sheet} onClick={e => e.stopPropagation()}>
          <div style={handle} />
          <div style={{ padding: "14px 16px 10px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={() => { setView("list"); setSearchQuery(""); setSearchResults([]); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px" }}>
                <X size={20} />
              </button>
              <div style={{ flex: 1, position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search area, street, sector, city..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: "100%", padding: "12px 36px 12px 38px", borderRadius: "12px", border: "1.5px solid var(--primary-green)", background: "var(--bg-card-subtle)", color: "var(--text-main)", fontSize: "14px", fontWeight: "500", outline: "none", boxSizing: "border-box" }}
                />
                {isSearching && <Loader2 size={15} className="animate-spin" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--primary-green)" }} />}
                {searchQuery && !isSearching && (
                  <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {searchResults.length === 0 && !isSearching && searchQuery.length > 1 && (
              <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)" }}>
                <MapPin size={36} style={{ margin: "0 auto 12px", opacity: 0.35, display: "block" }} />
                <div style={{ fontSize: "15px", fontWeight: "700" }}>No results found</div>
                <div style={{ fontSize: "12px", marginTop: "6px" }}>Try a different search term</div>
              </div>
            )}
            {isSearching && (
              <div style={{ display: "flex", justifyContent: "center", padding: "32px" }}>
                <Loader2 size={28} className="animate-spin" color="var(--primary-green)" />
              </div>
            )}
            {searchResults.map((item, i) => {
              const label = formatAddress(item.address, item.display_name);
              return (
                <div key={i} onClick={() => selectSearchResult(item)} style={{ ...rowStyle, gap: "12px" }}>
                  <div style={iconBox("rgba(107,114,128,0.1)")}><MapPin size={18} color="var(--text-muted)" /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-main)" }}>{label}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px" }}>{item.display_name}</div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>
        <style>{"@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}"}</style>
      </div>
    );
  }

  // ADD ADDRESS VIEW
  if (view === "add") {
    return (
      <div style={overlay} onClick={onClose}>
        <div style={sheet} onClick={e => e.stopPropagation()}>
          <div style={handle} />
          <div style={{ padding: "16px 16px 28px", display: "flex", flexDirection: "column", gap: "0", flex: 1, overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <button onClick={() => setView("list")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "var(--text-main)" }}>Add new address</h2>
            </div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.06em" }}>ADDRESS TYPE</div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {["Home", "Work", "Other"].map(t => (
                <button key={t} onClick={() => setAddForm(f => ({ ...f, title: t }))} style={{
                  padding: "8px 16px", borderRadius: "20px", border: "1.5px solid",
                  fontSize: "13px", fontWeight: "700", cursor: "pointer",
                  background: addForm.title === t ? "rgba(22,163,74,0.12)" : "var(--bg-card-subtle)",
                  borderColor: addForm.title === t ? "#16A34A" : "var(--border-glass)",
                  color: addForm.title === t ? "#16A34A" : "var(--text-muted)",
                  display: "flex", alignItems: "center", gap: "6px"
                }}>
                  {t === "Home" ? <HomeIcon size={14} /> : t === "Work" ? <Building2 size={14} /> : <MapPin size={14} />}
                  {t}
                </button>
              ))}
            </div>
            <form onSubmit={handleAddAddress} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.06em" }}>FULL ADDRESS</div>
                <textarea
                  placeholder="House / Flat no., Floor, Society, Sector, City"
                  value={addForm.address}
                  onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))}
                  required rows={3}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1.5px solid var(--border-glass)", background: "var(--bg-card-subtle)", color: "var(--text-main)", fontSize: "14px", outline: "none", resize: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.06em" }}>CONTACT NUMBER</div>
                <input
                  type="tel" placeholder="10-digit mobile number"
                  value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))}
                  maxLength={10}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1.5px solid var(--border-glass)", background: "var(--bg-card-subtle)", color: "var(--text-main)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <button type="submit" style={{ ...btnPrimary, marginTop: "8px" }}>Save Address</button>
            </form>
          </div>
        </div>
        <style>{"@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}"}</style>
      </div>
    );
  }

  // MAIN LIST VIEW
  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={e => e.stopPropagation()}>
        <div style={handle} />
        <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "var(--text-main)" }}>Select delivery location</h2>
          <button onClick={onClose} style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--bg-card-subtle)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>
        <div style={{ padding: "0 16px 14px", flexShrink: 0 }}>
          <div onClick={() => setView("search")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 16px", background: "var(--bg-card-subtle)", border: "1.5px solid var(--border-glass)", borderRadius: "14px", cursor: "pointer" }}>
            <Search size={17} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" }}>Search for area, street name...</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
          <div onClick={handleGPS} style={{ ...rowStyle, cursor: isLocatingGPS ? "wait" : "pointer", padding: "16px", opacity: isLocatingGPS ? 0.8 : 1 }}>
            <div style={iconBox("rgba(22,163,74,0.1)")}>
              {isLocatingGPS ? <Loader2 size={20} color="#16A34A" className="animate-spin" /> : <Navigation size={20} color="#16A34A" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "15px", fontWeight: "800", color: "#16A34A" }}>
                {isLocatingGPS ? "Detecting location..." : "Use my current location"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                {isLocatingGPS ? "Fetching GPS coordinates..." : "Using GPS / network location"}
              </div>
            </div>
            <ChevronRight size={18} color="#16A34A" style={{ flexShrink: 0 }} />
          </div>
          <div style={{ padding: "14px 16px 8px", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
            SAVED ADDRESSES
          </div>
          {savedAddresses.map((addr) => {
            const isActive = currentLocation && currentLocation.toLowerCase().includes(addr.title.toLowerCase());
            return (
              <div key={addr.id} onClick={() => selectSaved(addr)} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "14px 16px", cursor: "pointer", borderBottom: "1px solid var(--border-glass)", background: isActive ? "rgba(22,163,74,0.04)" : "transparent" }}>
                <div style={{ ...iconBox("#FEF3C7"), border: isActive ? "2px solid #16A34A" : "2px solid transparent", position: "relative" }}>
                  {isActive && (
                    <div style={{ position: "absolute", top: -5, right: -5, width: "16px", height: "16px", borderRadius: "50%", background: "#16A34A", border: "2px solid var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={9} color="#FFF" strokeWidth={3} />
                    </div>
                  )}
                  {addr.icon === "home" ? <HomeIcon size={20} color="#D97706" /> : <Building2 size={20} color="#D97706" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-main)" }}>{addr.title}</span>
                    <span style={{ fontSize: "9px", fontWeight: "700", padding: "2px 8px", borderRadius: "12px", background: isActive ? "rgba(22,163,74,0.12)" : "rgba(59,130,246,0.1)", color: isActive ? "#16A34A" : "#3B82F6", border: "1px solid", borderColor: isActive ? "rgba(22,163,74,0.3)" : "rgba(59,130,246,0.2)" }}>
                      {isActive ? "Current" : addr.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4, marginBottom: "3px" }}>{addr.address}</div>
                  {addr.phone && <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>+91 {addr.phone}</div>}
                </div>
                <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: "4px" }} />
              </div>
            );
          })}
          <div onClick={() => setView("add")} style={{ ...rowStyle, borderBottom: "none" }}>
            <div style={iconBox("rgba(22,163,74,0.08)")}><Plus size={20} color="#16A34A" strokeWidth={2.5} /></div>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#16A34A" }}>Add new address</span>
            <ChevronRight size={18} color="#16A34A" style={{ marginLeft: "auto" }} />
          </div>
        </div>
      </div>
      <style>{"@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}"}</style>
    </div>
  );
}