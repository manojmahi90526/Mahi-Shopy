/**
 * Mahi Shopy Shared Data Store & Firebase Resilient Adapter
 * Provides real-time sync with Firebase Realtime Database and guaranteed
 * fallback to local high-resolution fashion catalog if Firebase permissions are denied or offline.
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'zudio_store_catalog_v3';

  // High quality default fashion catalog seed data
  const DEFAULT_CATALOG = {
    mens_wear: {
      "m1": {
        name: "Classic Oxford Cotton Shirt",
        description: "100% premium breathable cotton with button-down collar and regular fit.",
        price: 29.99,
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80"
      },
      "m2": {
        name: "Vintage Washed Denim Jacket",
        description: "Rugged distressed denim jacket with dual flap chest pockets and relaxed silhouette.",
        price: 54.99,
        imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
      },
      "m3": {
        name: "Structured Tailored Navy Blazer",
        description: "Contemporary midnight navy single-breasted blazer for smart-casual and formal styling.",
        price: 79.99,
        imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80"
      },
      "m4": {
        name: "Urban Streetwear Fleece Hoodie",
        description: "Heavyweight brushed fleece hoodie with ribbed cuffs and cozy kangaroo pocket.",
        price: 42.50,
        imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80"
      },
      "m5": {
        name: "Relaxed Fit Utility Cargo Chinos",
        description: "Multi-pocket durable cotton twill trousers with comfort waistband and tapered leg.",
        price: 39.99,
        imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"
      },
      "m6": {
        name: "Premium Pique Cotton Polo",
        description: "Breathable textured cotton polo shirt with contrast ribbed collar and sleeve trim.",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80"
      },
      "m7": {
        name: "Slim-Fit Textured Linen Trousers",
        description: "Breathable pure linen trousers crafted with sharp creases and elasticated drawstring waist.",
        price: 44.99,
        imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80"
      },
      "m8": {
        name: "Genuine Leather Biker Jacket",
        description: "Classic asymmetrical zip biker jacket in smooth vegan grain leather with silver hardware.",
        price: 89.99,
        imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&auto=format&fit=crop&q=80"
      },
      "m9": {
        name: "Minimalist Crewneck Knit Sweater",
        description: "Fine-gauge merino blend knit sweater with ribbed trim and modern tailored silhouette.",
        price: 36.00,
        imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80"
      },
      "m10": {
        name: "Essential Heavyweight Graphic Tee",
        description: "Relaxed drop-shoulder heavyweight t-shirt featuring subtle typography back print.",
        price: 22.50,
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
      },
      "m11": {
        name: "Heritage Checked Flannel Overshirt",
        description: "Warm brushed cotton flannel overshirt with double chest patch pockets and horn buttons.",
        price: 48.00,
        imageUrl: "https://images.unsplash.com/photo-1602810316693-3667c854239a?w=600&auto=format&fit=crop&q=80"
      },
      "m12": {
        name: "Urban Performance Retro Sneakers",
        description: "Lightweight cushioned streetwear sneakers with suede accents and ergonomic grip sole.",
        price: 65.00,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
      },
      "m13": {
        name: "Tailored Charcoal Wool Overcoat",
        description: "Premium wool-blend longline overcoat with notched lapels and tailored interior pockets.",
        price: 119.99,
        imageUrl: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&auto=format&fit=crop&q=80"
      },
      "m14": {
        name: "Casual Drawstring Everyday Shorts",
        description: "Comfortable French terry cotton shorts with deep side pockets and adjustable waistband.",
        price: 26.99,
        imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop&q=80"
      }
    },
    womens_wear: {
      "w1": {
        name: "Floral Wrap Summer Midi Dress",
        description: "Airy lightweight chiffon dress with delicate floral motif and flattering wrap belt.",
        price: 45.00,
        imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80"
      },
      "w2": {
        name: "Oversized Minimalist Neutral Blazer",
        description: "Chic modern cut blazer with notched lapels and tortoiseshell buttons.",
        price: 68.99,
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80"
      },
      "w3": {
        name: "Emerald Silk Satin Button Blouse",
        description: "Lustrous emerald green silk blouse featuring point collar and tailored french cuffs.",
        price: 38.50,
        imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80"
      },
      "w4": {
        name: "High-Rise Wide Leg Linen Trousers",
        description: "Breathable airy linen pants designed with front pleats and tailored high waist.",
        price: 34.99,
        imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80"
      },
      "w5": {
        name: "Soft Ribbed Knit Cardigan",
        description: "Plush pastel knitwear featuring marbled buttons and ribbed hemlines.",
        price: 28.00,
        imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80"
      },
      "w6": {
        name: "Pleated Satin A-Line Maxi Skirt",
        description: "Flowy satin texture pleated skirt with gentle sheen and elastic waistband.",
        price: 39.50,
        imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop&q=80"
      },
      "w7": {
        name: "Vintage Distressed High-Rise Mom Jeans",
        description: "Classic rigid denim featuring a flattering high waist, tapered ankle, and vintage wash.",
        price: 46.00,
        imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80"
      },
      "w8": {
        name: "Elegant Ribbed Turtleneck Sweater Dress",
        description: "Figure-hugging midi sweater dress crafted from soft stretch knit with side slit detail.",
        price: 52.99,
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
      },
      "w9": {
        name: "Bohemian Tiered Ruffle Maxi Dress",
        description: "Flowing bohemian dress with delicate flutter sleeves, smocked bodice, and tier hemline.",
        price: 58.00,
        imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
      },
      "w10": {
        name: "Cropped Suede Moto Jacket",
        description: "Buttery soft faux suede motorcycle jacket with metallic zip accents and notched collar.",
        price: 74.50,
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
      },
      "w11": {
        name: "Modern Athleisure Seamless Leggings Set",
        description: "2-piece moisture-wicking ribbed crop top and high-waist sculpting compression leggings.",
        price: 42.00,
        imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80"
      },
      "w12": {
        name: "Chic Parisian Trench Coat",
        description: "Water-repellent double-breasted cotton blend trench coat with removable waist belt.",
        price: 98.00,
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80"
      },
      "w13": {
        name: "Embroidered Pastel Peasant Blouse",
        description: "Airy cotton-voile blouse with intricate contrast embroidery and tassel tie neckline.",
        price: 32.99,
        imageUrl: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600&auto=format&fit=crop&q=80"
      },
      "w14": {
        name: "Minimalist Structured Shoulder Bag",
        description: "Sleek vegan leather baguette shoulder handbag with gold-tone buckle and magnetic flap.",
        price: 39.99,
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80"
      }
    },
    kids_boys_wear: {
      "kb1": {
        name: "Jurassic Adventure Graphic Tee",
        description: "100% soft organic cotton crewneck t-shirt with vibrant dinosaur illustration.",
        price: 16.99,
        imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80"
      },
      "kb2": {
        name: "Sporty Colorblock Zip Windbreaker",
        description: "Lightweight water-resistant hooded jacket with active athletic stripes.",
        price: 29.99,
        imageUrl: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80"
      },
      "kb3": {
        name: "Comfort Stretch Denim Dungarees",
        description: "Durable adjustable shoulder strap overalls with reinforced knees for active play.",
        price: 27.50,
        imageUrl: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&auto=format&fit=crop&q=80"
      },
      "kb4": {
        name: "Cozy Fleece Pullover & Jogger Set",
        description: "2-piece matching cotton-blend hoodie and track pants set for daily warmth.",
        price: 32.00,
        imageUrl: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&auto=format&fit=crop&q=80"
      },
      "kb5": {
        name: "Little Explorer Cargo Shorts Set",
        description: "Breathable cotton crew tee paired with multi-pocket ripstop adventure cargo shorts.",
        price: 23.99,
        imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop&q=80"
      },
      "kb6": {
        name: "Classic Oxford Plaid Button-Down",
        description: "Smart casual check shirt tailored in 100% soft woven cotton with chest embroidery.",
        price: 21.50,
        imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80"
      },
      "kb7": {
        name: "Dynamic Racer Active Tracksuit",
        description: "Full zip sporty track jacket and matching tapered athletic joggers with contrast side tape.",
        price: 34.00,
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80"
      },
      "kb8": {
        name: "Cozy Padded Winter Puffer Vest",
        description: "Insulated lightweight quilted sleeveless jacket with stand collar and zipper pockets.",
        price: 28.99,
        imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80"
      },
      "kb9": {
        name: "Dinosaur Print Cotton Pajama Set",
        description: "Ultra-soft tagless organic cotton 2-piece nightwear set with elastic waistband.",
        price: 18.50,
        imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80"
      },
      "kb10": {
        name: "Retro High-Top Canvas Sneakers",
        description: "Durable canvas lace-up shoes with rubber toe-cap and cushioned inner sole for kids.",
        price: 26.00,
        imageUrl: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop&q=80"
      }
    },
    kids_girls_wear: {
      "kg1": {
        name: "Pastel Rainbow Tiered Twirl Dress",
        description: "Whimsical pure cotton party dress with flutter sleeves and ruffled hemline.",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&auto=format&fit=crop&q=80"
      },
      "kg2": {
        name: "Embroidered Butterfly Denim Jacket",
        description: "Charming cropped light wash jacket with intricate colorful embroidery.",
        price: 31.50,
        imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop&q=80"
      },
      "kg3": {
        name: "Floral Daisy Chunky Knit Cardigan",
        description: "Cozy round-neck knitted cardigan with daisy-shaped novelty buttons.",
        price: 22.99,
        imageUrl: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&auto=format&fit=crop&q=80"
      },
      "kg4": {
        name: "Sparkle Tulle Ruffle Skirt Set",
        description: "Glittering layered tulle party skirt paired with soft breathable cotton top.",
        price: 26.50,
        imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80"
      },
      "kg5": {
        name: "Floral Blossom Cotton Sun Dress",
        description: "Delightful floral print summer dress with criss-cross back straps and scalloped edge.",
        price: 21.99,
        imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
      },
      "kg6": {
        name: "Unicorn Sparkle Hooded Sweatshirt",
        description: "Cozy fleece pullover hoodie featuring shimmering metallic graphic and front pouch.",
        price: 25.00,
        imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80"
      },
      "kg7": {
        name: "Corduroy Pinafore Overall Dress",
        description: "Vintage-inspired soft velvet corduroy dress with brass buckles, perfect over long-sleeve tees.",
        price: 27.99,
        imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80"
      },
      "kg8": {
        name: "Ballerina Sparkle Tutu & Leggings",
        description: "Attached glitter tulle skirt over soft stretch cotton leggings for dance and play.",
        price: 22.50,
        imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80"
      },
      "kg9": {
        name: "Pastel Floral Quilted Puffer Jacket",
        description: "Warm down-alternative insulated winter coat with cozy faux-fur trimmed hood.",
        price: 36.00,
        imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80"
      },
      "kg10": {
        name: "Glitter Strap Mary Jane Shoes",
        description: "Charming party flats with sparkly finish, cushioned memory foam insole, and easy hook-and-loop strap.",
        price: 24.00,
        imageUrl: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&auto=format&fit=crop&q=80"
      }
    }
  };

  // Local Storage Management
  function getLocalCatalog() {
    try {
      // Check current v3 storage key or fall back to previous keys
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const prevRaw = localStorage.getItem('zudio_store_catalog_v2') || localStorage.getItem('zudio_store_catalog_v1');
        if (prevRaw) {
          raw = prevRaw;
        }
      }

      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATALOG));
        return JSON.parse(JSON.stringify(DEFAULT_CATALOG));
      }

      const data = JSON.parse(raw);
      let updated = false;

      // Ensure all 4 categories exist and merge any newly added catalog items
      ['mens_wear', 'womens_wear', 'kids_boys_wear', 'kids_girls_wear'].forEach(cat => {
        if (!data[cat] || Object.keys(data[cat]).length === 0) {
          data[cat] = JSON.parse(JSON.stringify(DEFAULT_CATALOG[cat]));
          updated = true;
        } else {
          // Merge default catalog items so new items show up seamlessly
          if (DEFAULT_CATALOG[cat]) {
            Object.keys(DEFAULT_CATALOG[cat]).forEach(itemKey => {
              if (!data[cat][itemKey]) {
                data[cat][itemKey] = DEFAULT_CATALOG[cat][itemKey];
                updated = true;
              }
            });
          }
        }
      });

      // Automatically upgrade any broken or missing image URLs to active valid catalog images
      if (data.mens_wear && data.mens_wear.m6 && (!data.mens_wear.m6.imageUrl || data.mens_wear.m6.imageUrl.includes('1625910513413'))) {
        data.mens_wear.m6.imageUrl = DEFAULT_CATALOG.mens_wear.m6.imageUrl;
        updated = true;
      }
      if (data.kids_girls_wear && data.kids_girls_wear.kg1 && (!data.kids_girls_wear.kg1.imageUrl || data.kids_girls_wear.kg1.imageUrl.includes('1621452773781'))) {
        data.kids_girls_wear.kg1.imageUrl = DEFAULT_CATALOG.kids_girls_wear.kg1.imageUrl;
        updated = true;
      }

      if (updated || !localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      return data;
    } catch (e) {
      console.warn('LocalStorage access warning:', e);
      return JSON.parse(JSON.stringify(DEFAULT_CATALOG));
    }
  }

  function saveLocalCatalog(catalog) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  function getLocalCategory(category) {
    const catalog = getLocalCatalog();
    return catalog[category] || {};
  }

  function setLocalCategory(category, items) {
    const catalog = getLocalCatalog();
    catalog[category] = items;
    saveLocalCatalog(catalog);
  }

  const ZudioStore = {
    // Bind category items: renders local catalog immediately, then syncs with Firebase if permitted
    bindCategory: function(category, onData, onError) {
      // 1. Immediately provide local data so the page displays products instantly without delay
      const localData = getLocalCategory(category);
      if (onData && typeof onData === 'function') {
        onData(localData);
      }

      // 2. If Firebase is initialized, attempt real-time listener
      if (window.firebase && firebase.apps && firebase.apps.length) {
        try {
          const database = firebase.database();
          database.ref(category).on('value', (snapshot) => {
            const remoteData = snapshot.val();
            if (remoteData && Object.keys(remoteData).length > 0) {
              setLocalCategory(category, remoteData);
              if (onData) onData(remoteData);
            } else if (!remoteData || Object.keys(remoteData).length === 0) {
              // Remote is empty, seed local data to remote if we have permissions
              const currentLocal = getLocalCategory(category);
              if (currentLocal && Object.keys(currentLocal).length > 0) {
                database.ref(category).set(currentLocal).catch(() => {});
              }
              if (onData) onData(currentLocal);
            }
          }, (err) => {
            console.warn(`[ZudioStore] Firebase real-time sync for '${category}' unavailable (${err.message}). Using local catalog.`);
            // Fallback ensures local catalog is rendered
            const fallbackData = getLocalCategory(category);
            if (onData) onData(fallbackData);
            if (onError) onError(err);
          });
        } catch (e) {
          console.warn('[ZudioStore] Firebase listener error:', e);
        }
      }
    },

    // Add new product item
    addItem: function(category, item, callback) {
      const key = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      const current = getLocalCategory(category);
      current[key] = item;
      setLocalCategory(category, current);

      let firebaseSynced = false;
      if (window.firebase && firebase.apps && firebase.apps.length) {
        try {
          firebase.database().ref(category + '/' + key).set(item)
            .then(() => {
              if (callback) callback(true, 'Item added successfully (synced to cloud)!', key);
            })
            .catch((err) => {
              console.warn('[ZudioStore] Cloud write permission denied, saved to local store:', err.message);
              if (callback) callback(true, 'Item saved locally! (Cloud permissions pending in Firebase)', key);
            });
          return;
        } catch (e) {
          console.warn('[ZudioStore] Firebase write error:', e);
        }
      }

      if (callback) callback(true, 'Item added to catalog!', key);
    },

    // Update existing product item
    updateItem: function(category, key, item, callback) {
      const current = getLocalCategory(category);
      current[key] = item;
      setLocalCategory(category, current);

      if (window.firebase && firebase.apps && firebase.apps.length) {
        try {
          firebase.database().ref(category + '/' + key).set(item)
            .then(() => {
              if (callback) callback(true, 'Item updated successfully (synced to cloud)!');
            })
            .catch((err) => {
              console.warn('[ZudioStore] Cloud update permission denied, updated locally:', err.message);
              if (callback) callback(true, 'Item updated locally!');
            });
          return;
        } catch (e) {
          console.warn('[ZudioStore] Firebase update error:', e);
        }
      }

      if (callback) callback(true, 'Item updated in catalog!');
    },

    // Delete product item
    deleteItem: function(category, key, callback) {
      const current = getLocalCategory(category);
      delete current[key];
      setLocalCategory(category, current);

      if (window.firebase && firebase.apps && firebase.apps.length) {
        try {
          firebase.database().ref(category + '/' + key).remove()
            .then(() => {
              if (callback) callback(true, 'Item deleted successfully (synced to cloud)!');
            })
            .catch((err) => {
              console.warn('[ZudioStore] Cloud delete permission denied, deleted locally:', err.message);
              if (callback) callback(true, 'Item deleted locally!');
            });
          return;
        } catch (e) {
          console.warn('[ZudioStore] Firebase delete error:', e);
        }
      }

      if (callback) callback(true, 'Item removed from catalog!');
    },

    // Get all products across categories for carousel / searches
    getAllProducts: function(callback) {
      const catalog = getLocalCatalog();
      const all = [];
      ['mens_wear', 'womens_wear', 'kids_boys_wear', 'kids_girls_wear'].forEach(cat => {
        if (catalog[cat]) {
          Object.keys(catalog[cat]).forEach(k => {
            all.push({ ...catalog[cat][k], _key: k, _category: cat });
          });
        }
      });
      if (callback) callback(all);
      return all;
    },

    // Cart Management
    getCart: function() {
      try {
        const cart = localStorage.getItem('shoppingCart');
        return cart ? JSON.parse(cart) : [];
      } catch (e) {
        console.error('Error reading cart from localStorage', e);
        return [];
      }
    },

    saveCart: function(cart) {
      try {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart, count: this.getCartCount() } }));
      } catch (e) {
        console.error('Error saving cart to localStorage', e);
      }
    },

    addToCart: function(item, qty = 1) {
      const cart = this.getCart();
      const existingIndex = cart.findIndex(ci => ci.name === item.name || (item._key && ci._key === item._key));
      if (existingIndex >= 0) {
        cart[existingIndex].quantity = (Number(cart[existingIndex].quantity) || 1) + Number(qty);
      } else {
        cart.push({
          _key: item._key || item.key || ('item_' + Date.now()),
          name: item.name || 'Fashion Item',
          description: item.description || '',
          price: Number(item.price) || 0,
          imageUrl: item.imageUrl || '',
          category: item._category || item.category || '',
          quantity: Number(qty) || 1
        });
      }
      this.saveCart(cart);
      return cart;
    },

    updateCartQty: function(index, qty) {
      const cart = this.getCart();
      if (index >= 0 && index < cart.length) {
        const newQty = parseInt(qty, 10);
        if (newQty <= 0) {
          cart.splice(index, 1);
        } else {
          cart[index].quantity = newQty;
        }
        this.saveCart(cart);
      }
      return cart;
    },

    removeFromCart: function(index) {
      const cart = this.getCart();
      if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        this.saveCart(cart);
      }
      return cart;
    },

    clearCart: function() {
      this.saveCart([]);
      return [];
    },

    getCartCount: function() {
      const cart = this.getCart();
      return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
    },

    getCartTotal: function() {
      const cart = this.getCart();
      return cart.reduce((total, item) => total + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
    },

    // Order Management
    saveOrder: function(orderData) {
      try {
        const orders = this.getOrderHistory();
        orders.unshift({
          ...orderData,
          createdAt: new Date().toISOString(),
          status: 'Confirmed'
        });
        localStorage.setItem('mahi_order_history', JSON.stringify(orders));
        this.clearCart();
        return true;
      } catch (e) {
        console.error('Error saving order', e);
        return false;
      }
    },

    getOrderHistory: function() {
      try {
        const orders = localStorage.getItem('mahi_order_history');
        return orders ? JSON.parse(orders) : [];
      } catch (e) {
        return [];
      }
    }
  };

  // Expose to window
  window.ZudioStore = ZudioStore;
  window.MahiStore = ZudioStore;
  // Initialize storage on load
  getLocalCatalog();

})(typeof window !== 'undefined' ? window : this);
