'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Package, Search, Database } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePageTitle } from '@/hooks/usePageTitle';
import Navigation from '@/components/layout/Navigation';

interface BankItem {
  id: number;
  name: string;
  icon?: string;
  count: number;
  rarity?: string;
  type?: string;
  slot: number;
  bound?: boolean;
  value?: number;
}

interface BankSummary {
  totalBuyPrice: number;
  totalSellPrice: number;
  totalValue: number;
  usedSlots: number;
  totalSlots: number;
}

interface ItemPrice {
  id: number;
  whitelisted: boolean;
  buys: {
    unit_price: number;
    quantity: number;
  };
  sells: {
    unit_price: number;
    quantity: number;
  };
}

interface ItemDetails {
  id: number;
  name: string;
  description?: string;
  type?: string;
  level?: number;
  rarity?: string;
  icon?: string;
  vendor_value?: number;
}

const BankPage = () => {
  const { isAuthenticated } = useAuth();
  usePageTitle('pageTitles.bank', 'Bank');
  const [bankItems, setBankItems] = useState<(BankItem | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bankSummary, setBankSummary] = useState<BankSummary>({
    totalBuyPrice: 0,
    totalSellPrice: 0,
    totalValue: 0,
    usedSlots: 0,
    totalSlots: 30
  });
  const [selectedItem, setSelectedItem] = useState<{ item: BankItem; details: ItemDetails; price?: ItemPrice } | null>(null);
  const [isLoadingItemDetails, setIsLoadingItemDetails] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [itemCache, setItemCache] = useState<Map<number, { details: ItemDetails; price?: ItemPrice }>>(new Map());

  const formatGold = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemaining = copper % 100;
    return { gold, silver, copper: copperRemaining };
  };

  const getRarityBorderColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'border-yellow-400';
      case 'exotic': return 'border-orange-400';
      case 'rare': return 'border-blue-400';
      case 'masterwork': return 'border-green-400';
      case 'fine': return 'border-blue-300';
      case 'ascended': return 'border-purple-400';
      default: return 'border-gray-500';
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'text-yellow-400';
      case 'exotic': return 'text-orange-400';
      case 'rare': return 'text-blue-400';
      case 'masterwork': return 'text-green-400';
      case 'fine': return 'text-blue-300';
      case 'ascended': return 'text-purple-400';
      default: return 'text-gray-300';
    }
  };

  const handleItemHover = async (item: BankItem, event: React.MouseEvent) => {
    // Set position immediately
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({ x: rect.right + 10, y: rect.top });
    
    // Check if item is already cached
    const cached = itemCache.get(item.id);
    if (cached) {
      setSelectedItem({ item, details: cached.details, price: cached.price });
      return;
    }
    
    // Don't fetch if already loading or if same item is selected
    if (isLoadingItemDetails || (selectedItem && selectedItem.item.id === item.id)) {
      return;
    }

    setIsLoadingItemDetails(true);
    setSelectedItem(null);
    
    try {
      // Fetch item details
      const detailsResponse = await fetch(`https://api.guildwars2.com/v2/items/${item.id}`, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br'
        }
      });
      const details: ItemDetails = await detailsResponse.json();
      
      // Fetch item price
      const priceResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices/${item.id}`, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br'
        }
      });
      const price: ItemPrice = await priceResponse.json();
      
      // Cache the result
      setItemCache(prev => new Map(prev).set(item.id, { details, price }));
      
      setSelectedItem({ item, details, price });
    } catch (error) {
      console.error('Error fetching item details:', error);
      // If price fetch fails, still show item details
      try {
        const detailsResponse = await fetch(`https://api.guildwars2.com/v2/items/${item.id}`);
        const details: ItemDetails = await detailsResponse.json();
        
        // Cache the result (without price)
        setItemCache(prev => new Map(prev).set(item.id, { details }));
        
        setSelectedItem({ item, details });
      } catch (detailsError) {
        console.error('Error fetching item details:', detailsError);
      }
    } finally {
      setIsLoadingItemDetails(false);
    }
  };

  const handleItemLeave = () => {
    setSelectedItem(null);
  };



                       useEffect(() => {
       const fetchBankData = async () => {
         try {
           console.log('🔄 Fetching bank data...');
           setIsLoading(true);
           const apiKey = localStorage.getItem('gw2_api_key');
           if (!apiKey) {
             console.error('❌ No API key found');
             return;
           }
           
           console.log('🔑 API Key found, fetching bank data...');
           const response = await fetch(`/api/gw2/bank?api_key=${apiKey}`);
           if (response.ok) {
             const data = await response.json();
                         console.log('✅ Bank data received:', data.length, 'items');
              setBankItems(data);
              // Calculate prices after loading bank data
              console.log('💰 Calculating bank summary...');
              await calculateBankSummary(data);
              // Pre-load item details for price display
              console.log('🔄 Pre-loading item details for price display...');
              
                             // Pre-load item details inline
               const validItems = data.filter((item: unknown): item is BankItem => item !== null);
               const uniqueItemIds = [...new Set(validItems.map((item: BankItem) => item.id))];
               
               // Only load items that aren't already cached
               const uncachedItems = uniqueItemIds.filter((id: unknown) => !itemCache.has(id as number));
              
              if (uncachedItems.length > 0) {
                console.log(`🔄 Pre-loading ${uncachedItems.length} items...`);
                
                // Load in batches to avoid overwhelming the API
                const batchSize = 10;
                for (let i = 0; i < uncachedItems.length; i += batchSize) {
                  const batch = uncachedItems.slice(i, i + batchSize);
                  
                  try {
                    // Fetch item details
                    const detailsPromises = batch.map(id => 
                      fetch(`https://api.guildwars2.com/v2/items/${id}`).then(res => res.json())
                    );
                    const details = await Promise.all(detailsPromises);
                    
                    // Fetch prices
                    const pricesPromises = batch.map(id => 
                      fetch(`https://api.guildwars2.com/v2/commerce/prices/${id}`).then(res => res.json()).catch(() => null)
                    );
                    const prices = await Promise.all(pricesPromises);
                    
                                         // Cache results
                     batch.forEach((id: unknown, index) => {
                       setItemCache(prev => new Map(prev).set(id as number, { 
                         details: details[index], 
                         price: prices[index] 
                       }));
                     });
                    
                    console.log(`✅ Cached batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(uncachedItems.length / batchSize)}`);
                  } catch (error) {
                    console.error('❌ Error pre-loading item details:', error);
                  }
                }
                
                console.log('✅ Pre-loading completed');
              } else {
                console.log('✅ All items already cached');
              }
           } else {
             console.error('❌ Error response:', response.status, response.statusText);
           }
         } catch (error) {
           console.error('❌ Error fetching bank:', error);
         } finally {
           setIsLoading(false);
           console.log('✅ Bank data loading completed');
         }
       };

       if (isAuthenticated) {
         console.log('🔐 User authenticated, starting bank fetch...');
         fetchBankData();
       } else {
         console.log('❌ User not authenticated');
       }
     }, [isAuthenticated, itemCache]);

  const filteredItems = bankItems.filter((item): item is BankItem => 
    item !== null && 
    typeof item.name === 'string' && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fixed grid of 10x3 (30 slots) like GW2 bank
  const maxSlots = 30;

  // Calculate bank summary with real prices
  const calculateBankSummary = async (items: (BankItem | null)[]) => {
    // Filter out null items (empty slots)
    const validItems = items.filter((item): item is BankItem => item !== null);
    
    console.log('Valid items found:', validItems.length);
    console.log('Valid items:', validItems);
    
    if (validItems.length === 0) {
      console.log('No valid items, setting summary to 0');
      setBankSummary({
        totalBuyPrice: 0,
        totalSellPrice: 0,
        totalValue: 0,
        usedSlots: 0,
        totalSlots: maxSlots
      });
      return;
    }

    try {
      // Get unique item IDs
      const itemIds = [...new Set(validItems.map(item => item.id))];
      console.log('Item IDs to fetch prices for:', itemIds);
      
      // Fetch prices from GW2 API
      const pricesResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${itemIds.join(',')}`);
      console.log('Prices response status:', pricesResponse.status);
      
      if (pricesResponse.ok) {
        const prices: ItemPrice[] = await pricesResponse.json();
        console.log('Prices received:', prices);
        
                 let totalBuyPrice = 0;
         let totalSellPrice = 0;
         
                   validItems.forEach(item => {
            const price = prices.find(p => p.id === item.id);
            if (price) {
              // Buy price (left side) - what we pay when buying (sell order price - higher)
              const buyPrice = price.buys.unit_price * item.count;
              // Sell price (right side) - what we get when selling (buy order price - lower)
              const sellPrice = price.sells.unit_price * item.count;
              
              totalBuyPrice += buyPrice;
              totalSellPrice += sellPrice;
             
           } else {
             // Item has no Trading Post price, use crafting value
             const craftingValue = (item.value || 0) * item.count;
             console.log(`No TP price for ${item.name}, using crafting value: ${craftingValue} copper`);
             
             // For items without TP prices, use crafting value for both buy and sell
             totalBuyPrice += craftingValue;
             totalSellPrice += craftingValue;
           }
         });
         
         console.log('Final totals:', { totalBuyPrice, totalSellPrice, difference: totalBuyPrice - totalSellPrice });
         console.log('Price difference percentage:', ((totalBuyPrice - totalSellPrice) / totalBuyPrice * 100).toFixed(2) + '%');
         
                   setBankSummary({
            totalBuyPrice: totalBuyPrice, // Total Buy Price = sum of all buy prices (left side)
            totalSellPrice: totalSellPrice, // Total Sell Price = sum of all sell prices (right side)
            totalValue: totalSellPrice, // Total value = sell price (includes TP + crafting values)
            usedSlots: validItems.length,
            totalSlots: maxSlots
          });
      } else {
        console.error('Prices response not ok:', pricesResponse.status, pricesResponse.statusText);
      }
    } catch (error) {
      console.error('Error calculating bank summary:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Access Required</h2>
          <Link href="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/account" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Account
          </Link>
          <h1 className="text-3xl font-bold mb-2">Bank</h1>
          <p className="text-gray-400">Your bank inventory</p>
        </div>

                 {/* Search and Refresh */}
         <div className="mb-6 flex gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
             <input
               type="text"
               placeholder="Search bank..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
             />
           </div>
           <button
             onClick={() => {
               console.log('🔄 Manual refresh triggered');
               setIsLoading(true);
               const apiKey = localStorage.getItem('gw2_api_key');
               if (apiKey) {
                 fetch(`/api/gw2/bank?api_key=${apiKey}`)
                   .then(response => response.json())
                   .then(data => {
                     setBankItems(data);
                     calculateBankSummary(data);
                   })
                   .catch(error => console.error('❌ Refresh error:', error))
                   .finally(() => setIsLoading(false));
               }
             }}
             className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
           >
             🔄 Refresh
           </button>
         </div>

                 {isLoading ? (
           <div className="text-center py-12">
             <div className="animate-spin rounded-full h-15 w-15 border-b-2 border-blue-500 mx-auto mb-4"></div>
             <p className="text-gray-400">Loading bank...</p>
           </div>
         ) : (
           <div className="space-y-6">
                           {/* Financial Summary */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 max-w-2xl mx-auto">
                                                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                   <div className="text-center">
                                                                                   <h3 className="text-base font-semibold mb-2">Total Buy Price</h3>
                                           <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center space-x-1">
                        {(() => {
                          const { gold, silver, copper } = formatGold(Math.floor(bankSummary.totalBuyPrice * 0.85));
                          return (
                            <>
                              <span>{gold}</span>
                              <Image src="/images/expansions/Gold.webp" alt="Gold" width={20} height={20} />
                              <span>{silver}</span>
                              <Image src="/images/expansions/Silver.webp" alt="Silver" width={20} height={20} />
                              <span>{copper}</span>
                              <Image src="/images/expansions/Copper.webp" alt="Copper" width={20} height={20} />
                            </>
                          );
                        })()}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center justify-center space-x-1">
                        {(() => {
                          const { gold, silver, copper } = formatGold(bankSummary.totalBuyPrice);
                          return (
                            <>
                              <span>{gold}</span>
                              <Image src="/images/expansions/Gold.webp" alt="Gold" width={16} height={16} />
                              <span>{silver}</span>
                              <Image src="/images/expansions/Silver.webp" alt="Silver" width={16} height={16} />
                              <span>{copper}</span>
                              <Image src="/images/expansions/Copper.webp" alt="Copper" width={16} height={16} />
                            </>
                          );
                        })()}
                        <span className="ml-1">excl. fees</span>
                      </div>
                                      </div>
                                      <div className="text-center">
                                            <h3 className="text-base font-semibold mb-2">Total Sell Price</h3>
                                            <div className="text-2xl font-bold text-green-400 flex items-center justify-center space-x-1">
                         {(() => {
                           const { gold, silver, copper } = formatGold(Math.floor(bankSummary.totalSellPrice * 0.85));
                           return (
                             <>
                               <span>{gold}</span>
                               <Image src="/images/expansions/Gold.webp" alt="Gold" width={20} height={20} />
                               <span>{silver}</span>
                               <Image src="/images/expansions/Silver.webp" alt="Silver" width={20} height={20} />
                               <span>{copper}</span>
                               <Image src="/images/expansions/Copper.webp" alt="Copper" width={20} height={20} />
                             </>
                           );
                         })()}
                       </div>
                       <div className="text-sm text-gray-400 flex items-center justify-center space-x-1">
                         {(() => {
                           const { gold, silver, copper } = formatGold(bankSummary.totalSellPrice);
                           return (
                             <>
                               <span>{gold}</span>
                               <Image src="/images/expansions/Gold.webp" alt="Gold" width={12} height={12} />
                               <span>{silver}</span>
                               <Image src="/images/expansions/Silver.webp" alt="Silver" width={12} height={12} />
                               <span>{copper}</span>
                               <Image src="/images/expansions/Copper.webp" alt="Copper" width={12} height={12} />
                             </>
                           );
                         })()}
                         <span className="ml-1">excl. fees</span>
                       </div>
                    </div>
               </div>
               
                               {/* Bank Usage */}
                <div className="text-center mb-4">
                  <p className="text-lg text-gray-300">
                    You are using {bankSummary.usedSlots} of {bankSummary.totalSlots} ({((bankSummary.usedSlots / bankSummary.totalSlots) * 100).toFixed(2)}%) available bank slots.
                  </p>
                </div>
                
                                 {/* Current Slot Count & Currency */}
                 <div className="flex items-center justify-center space-x-4">
                   <span className="text-xl font-semibold">{bankSummary.usedSlots} / {bankSummary.totalSlots} slots</span>
                   <div className="flex items-center space-x-1">
                     <span className="text-yellow-400">{Math.floor(bankSummary.totalValue / 10000)}</span>
                     <Image src="/images/expansions/Gold.webp" alt="Gold" width={16} height={16} />
                                           <span className="text-gray-400">{Math.floor((bankSummary.totalValue % 10000) / 100)}</span>
                      <Image src="/images/expansions/Silver.webp" alt="Silver" width={16} height={16} />
                      <span className="text-orange-400">{bankSummary.totalValue % 100}</span>
                      <Image src="/images/expansions/Copper.webp" alt="Copper" width={16} height={16} />
                   </div>
                 </div>
             </div>

                                                       {/* Bank Grid */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-5xl mx-auto">
                             <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-semibold flex items-center">
                   <Package className="w-5 h-5 mr-2 text-blue-500" />
                   Bank Tab 1
                 </h2>
                 <div className="text-sm text-gray-400">
                   {filteredItems.length} items • 30 slots
                 </div>
               </div>
              
                                            <div className="grid grid-cols-10 gap-0.6 max-w-3xl mx-auto">
                 {Array.from({ length: maxSlots }, (_, slotIndex) => {
                   const item = bankItems[slotIndex]; // Get item directly from bankItems array
                   
                   return (
                     <div 
                       key={slotIndex} 
                                                                                               className={`
                           w-16 h-24 rounded border-2 flex flex-col items-center justify-center p-0.6 relative
                          ${item 
                            ? `${getRarityBorderColor(item.rarity)} bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer group` 
                            : 'border-dashed border-gray-600 bg-gray-800'
                          }
                        `}
                                               title={item ? `${item.name} (Slot ${slotIndex + 1})` : `Slot ${slotIndex + 1} empty`}
                        onMouseEnter={(e) => item && handleItemHover(item, e)}
                        onMouseLeave={handleItemLeave}
                      >
                                                                                               {item ? (
                          <>
                                                         {/* Item icon as background */}
                             {item.icon && (
                               <Image 
                                 src={item.icon} 
                                 alt={item.name}
                                                                   width={72}
                                  height={72}
                                  className="w-18 h-18 object-contain mb-1"
                               />
                             )}
                             
                             {/* Quantity in center (large white number) */}
                             {item.count > 1 && (
                                                               <span className="text-xl text-white font-bold absolute inset-0 flex items-center justify-center drop-shadow-lg">
                                 {item.count}
                               </span>
                             )}
                             
                             {/* Bound indicator */}
                             {item.bound && (
                               <span className="text-xs text-gray-300 font-semibold absolute top-0 right-0 px-1">
                                 Bound
                               </span>
                             )}
                             
                                                           {/* Price display at bottom (black background) */}
                                                             <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-sm py-1 flex items-center justify-center">
                               <span className="font-bold">
                                 {(() => {
                                   // Get price from cache or calculate
                                   const cached = itemCache.get(item.id);
                                   if (cached) {
                                     let totalPrice = 0;
                                     
                                     // Prefer Trading Post sell price, fallback to vendor value
                                     if (cached.price && cached.price.sells && cached.price.sells.unit_price > 0) {
                                       totalPrice = cached.price.sells.unit_price * item.count;
                                     } else if (cached.details && cached.details.vendor_value) {
                                       totalPrice = cached.details.vendor_value * item.count;
                                     }
                                     
                                     if (totalPrice > 0) {
                                       const { gold, silver, copper } = formatGold(totalPrice);
                                       return gold > 0 ? `${gold}g` : silver > 0 ? `${silver}s` : `${copper}c`;
                                     }
                                   }
                                   return '';
                                 })()}
                               </span>
                                 {(() => {
                                  const cached = itemCache.get(item.id);
                                  if (cached) {
                                    let totalPrice = 0;
                                    
                                    if (cached.price && cached.price.sells && cached.price.sells.unit_price > 0) {
                                      totalPrice = cached.price.sells.unit_price * item.count;
                                    } else if (cached.details && cached.details.vendor_value) {
                                      totalPrice = cached.details.vendor_value * item.count;
                                    }
                                    
                                    if (totalPrice > 0) {
                                      const { gold, silver } = formatGold(totalPrice);
                                        if (gold > 0) {
                                        return <Image src="/images/expansions/Gold.webp" alt="Gold" width={12} height={12} className="ml-1" />;
                                       } else if (silver > 0) {
                                         return <Image src="/images/expansions/Silver.webp" alt="Silver" width={12} height={12} className="ml-1" />;
                                       } else {
                                         return <Image src="/images/expansions/Copper.webp" alt="Copper" width={12} height={12} className="ml-1" />;
                                      }
                                    }
                                  }
                                  return null;
                                })()}
                             </div>
                          </>
                        ) : null}
                     </div>
                   );
                 })}
               </div>
              
              
            </div>
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No items</h3>
            <p className="text-gray-400">There are no items in your bank</p>
          </div>
                 )}

         {/* Item Details Modal */}
         {selectedItem && (
           <div 
             className="fixed z-50 pointer-events-none"
             style={{ 
               left: `${hoverPosition.x}px`, 
               top: `${hoverPosition.y}px`,
                               maxWidth: '300px',
                maxHeight: '60vh'
             }}
           >
                           <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-h-full overflow-y-auto shadow-2xl pointer-events-auto">
                <div className="p-4">
                                   {/* Header */}
                                     <div className="flex items-center mb-3">
                     <div className="flex items-center space-x-2">
                       {selectedItem.details.icon && (
                         <Image 
                           src={selectedItem.details.icon} 
                           alt={selectedItem.details.name}
                           width={32}
                           height={32}
                           className="rounded"
                         />
                       )}
                       <div>
                         <h3 className={`text-sm font-bold ${getRarityColor(selectedItem.details.rarity)}`}>
                           {selectedItem.item.count > 1 && `${selectedItem.item.count}x `}
                           {selectedItem.details.name}
                         </h3>
                         <p className="text-xs text-gray-400">
                           {selectedItem.details.type} {selectedItem.details.level && `• Level ${selectedItem.details.level}`}
                         </p>
                       </div>
                     </div>
                   </div>

                                   {/* Description */}
                  {selectedItem.details.description && (
                    <div className="mb-3">
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {selectedItem.details.description}
                      </p>
                    </div>
                  )}

                                   {/* Prices */}
                                     {(selectedItem.price || selectedItem.details.vendor_value) && (
                     <div className="space-y-2">
                       <h4 className="text-sm font-semibold text-gray-200">Prices</h4>
                      
                      {/* Vendor Price - Always show if available */}
                      {selectedItem.details.vendor_value && (
                                                 <div className="flex justify-between items-center">
                           <span className="text-gray-400 text-xs">Vendor Price:</span>
                           <div className="flex items-center space-x-1">
                            {(() => {
                              const { gold, silver, copper } = formatGold(selectedItem.details.vendor_value!);
                              return (
                                <>
                                  <span>{gold}</span>
                                  <Image src="/images/expansions/Gold.webp" alt="Gold" width={12} height={12} />
                                  <span>{silver}</span>
                                  <Image src="/images/expansions/Silver.webp" alt="Silver" width={12} height={12} />
                                  <span>{copper}</span>
                                  <Image src="/images/expansions/Copper.webp" alt="Copper" width={12} height={12} />
                                </>
                              );
                            })()}
                                                         <span className="text-gray-400 text-xs ml-2">
                               ({(() => {
                                 const { gold, silver, copper } = formatGold(selectedItem.details.vendor_value! * selectedItem.item.count);
                                 return `${gold}g ${silver}s ${copper}c per ${selectedItem.item.count}`;
                               })()})
                             </span>
                          </div>
                        </div>
                      )}

                      {/* Trading Post Prices - Only show if available */}
                      {selectedItem.price && (
                        <>
                                                     {/* Buy Price - Only show if exists */}
                           {selectedItem.price.buys && selectedItem.price.buys.unit_price > 0 && (
                             <div className="flex justify-between items-center">
                               <span className="text-gray-400 text-xs">Buy Price:</span>
                              <div className="flex items-center space-x-1">
                                {(() => {
                                  const { gold, silver, copper } = formatGold(selectedItem.price.buys.unit_price);
                                  return (
                                    <>
                                      <span>{gold}</span>
                                      <Image src="/images/expansions/Gold.webp" alt="Gold" width={12} height={12} />
                                      <span>{silver}</span>
                                      <Image src="/images/expansions/Silver.webp" alt="Silver" width={12} height={12} />
                                      <span>{copper}</span>
                                      <Image src="/images/expansions/Copper.webp" alt="Copper" width={12} height={12} />
                                    </>
                                  );
                                })()}
                                                                 <span className="text-gray-400 text-xs ml-2">
                                   ({(() => {
                                     const { gold, silver, copper } = formatGold(selectedItem.price.buys.unit_price * selectedItem.item.count);
                                     return `${gold}g ${silver}s ${copper}c per ${selectedItem.item.count}`;
                                   })()})
                                 </span>
                              </div>
                            </div>
                          )}

                                                     {/* Sell Price - Only show if exists */}
                           {selectedItem.price.sells && selectedItem.price.sells.unit_price > 0 && (
                             <div className="flex justify-between items-center">
                               <span className="text-gray-400 text-xs">Sell Price:</span>
                              <div className="flex items-center space-x-1">
                                {(() => {
                                  const { gold, silver, copper } = formatGold(selectedItem.price.sells.unit_price);
                                  return (
                                    <>
                                      <span>{gold}</span>
                                      <Image src="/images/expansions/Gold.webp" alt="Gold" width={12} height={12} />
                                      <span>{silver}</span>
                                      <Image src="/images/expansions/Silver.webp" alt="Silver" width={12} height={12} />
                                      <span>{copper}</span>
                                      <Image src="/images/expansions/Copper.webp" alt="Copper" width={12} height={12} />
                                    </>
                                  );
                                })()}
                                                                 <span className="text-gray-400 text-xs ml-2">
                                   ({(() => {
                                     const { gold, silver, copper } = formatGold(selectedItem.price.sells.unit_price * selectedItem.item.count);
                                     return `${gold}g ${silver}s ${copper}c per ${selectedItem.item.count}`;
                                   })()})
                                 </span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
               </div>
             </div>
           </div>
         )}

         
       </div>
     </div>
   );
 };

export default BankPage; 