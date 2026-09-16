import { connectDB } from "./connect";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { Category } from "@/models/Category";
import { FarmBatch } from "@/models/FarmBatch";
import { Product } from "@/models/Product";
import { DeliveryZone } from "@/models/DeliveryZone";
import { DeliverySlot } from "@/models/DeliverySlot";
import { Coupon } from "@/models/Coupon";
import { BlogPost } from "@/models/BlogPost";
import { StockItem } from "@/models/StockItem";
import { StaffMember } from "@/models/StaffMember";
import { Attendance } from "@/models/Attendance";
import { Task } from "@/models/Task";
import { EquipmentAsset } from "@/models/EquipmentAsset";
import { ExpenseEntry } from "@/models/ExpenseEntry";
import { ContentBlock } from "@/models/ContentBlock";
import {
  USER_ROLES,
  PRODUCT_TYPES,
  FULFILLMENT_TYPES,
  SHIPPING_ELIGIBILITY,
  PRODUCT_STATUS,
  FARM_BATCH_STATUSES,
} from "@/config/constants";

export async function seedDatabase() {
  await connectDB();
  console.log("Connected to MongoDB for Stakna Farmhouse seeding...");

  // 1. Seed Admin User
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@onela.in").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "Jigdor@123";
  let adminUser = await User.findOne({ email: adminEmail });

  if (!adminUser) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    adminUser = await User.create({
      name: "Jigmat Dorjey",
      email: adminEmail,
      phone: "+91 94191 78901",
      passwordHash,
      role: USER_ROLES.ADMIN,
    });
    console.log("Admin user seeded:", adminEmail);
  }

  // 2. Seed Delivery Zones
  const zoneCount = await DeliveryZone.countDocuments();
  if (zoneCount === 0) {
    await DeliveryZone.insertMany([
      {
        name: "Leh Town & Central",
        code: "LEH-CENTRAL",
        areas: [
          "Leh Main Bazaar",
          "Fort Road",
          "Changspa",
          "Old Town",
          "Skara",
          "Karzoo",
          "Sankar",
          "Tukcha",
          "Airport Road",
          "Housing Colony",
        ],
        deliveryFee: 40,
        minOrderValue: 200,
        freeDeliveryThreshold: 700,
        allowedProductTypes: Object.values(PRODUCT_TYPES),
        isActive: true,
      },
      {
        name: "Choglamsar & Shey Corridor",
        code: "CHOGLAMSAR-SHEY",
        areas: ["Choglamsar", "SOS Village", "Saboo", "Shey", "Thiksey", "Sindhu Ghat"],
        deliveryFee: 60,
        minOrderValue: 250,
        freeDeliveryThreshold: 900,
        allowedProductTypes: Object.values(PRODUCT_TYPES),
        isActive: true,
      },
      {
        name: "Stakna & Indus Valley East",
        code: "STAKNA-VALLEY",
        areas: ["Stakna", "Nang", "Ranbirpur", "Matho", "Spituk", "Phey"],
        deliveryFee: 50,
        minOrderValue: 200,
        freeDeliveryThreshold: 800,
        allowedProductTypes: Object.values(PRODUCT_TYPES),
        isActive: true,
      },
      {
        name: "Rest of India & Pan-India Shipping",
        code: "PAN-INDIA",
        areas: ["Rest of India", "Kargil", "Nubra", "Zanskar"],
        deliveryFee: 120,
        minOrderValue: 350,
        freeDeliveryThreshold: 1500,
        allowedProductTypes: [PRODUCT_TYPES.VALUE_ADDED, PRODUCT_TYPES.PASHMINA],
        isActive: true,
      },
    ]);
    console.log("Seeded delivery zones.");
  }

  // 3. Seed Delivery Slots
  const slotCount = await DeliverySlot.countDocuments();
  if (slotCount === 0) {
    await DeliverySlot.insertMany([
      {
        title: "Morning Fresh Harvest (08:00 AM – 10:30 AM)",
        startTime: "08:00",
        endTime: "10:30",
        cutoffMinutesBefore: 120,
        maxOrdersPerDay: 25,
        activeDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: true,
      },
      {
        title: "Afternoon Valley Delivery (02:00 PM – 04:30 PM)",
        startTime: "14:00",
        endTime: "16:30",
        cutoffMinutesBefore: 90,
        maxOrdersPerDay: 30,
        activeDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: true,
      },
    ]);
    console.log("Seeded delivery slots.");
  }

  // 4. Seed Categories (Vegetables, Flowers, Saplings, Value-Added, Pashmina, Baskets)
  const categoryDefinitions = [
    {
      name: "Fresh Vegetables",
      slug: "vegetables",
      description: "Organically grown high-altitude vegetables harvested fresh daily in Stakna.",
      image: "/images/dining.jpg",
      productType: PRODUCT_TYPES.VEGETABLE,
      displayOrder: 1,
      isActive: true,
    },
    {
      name: "Fresh Flowers & Bouquets",
      slug: "flowers",
      description: "Vibrant Himalayan cut blooms, prayer offerings, and custom event arrangements.",
      image: "/images/suite-riverfront.jpg",
      productType: PRODUCT_TYPES.FLOWER,
      displayOrder: 2,
      isActive: true,
    },
    {
      name: "Fruit & Tree Saplings",
      slug: "saplings",
      description: "Cold-hardy apricot, apple, and greenhouse vegetable saplings for Himalayan gardens.",
      image: "/images/hero.jpg",
      productType: PRODUCT_TYPES.SAPLING,
      displayOrder: 3,
      isActive: true,
    },
    {
      name: "Value-Added Farm Goods",
      slug: "value-added",
      description: "Sun-dried Halman apricots, wild seabuckthorn preserves, and organic Tsampa.",
      image: "/images/dining.jpg",
      productType: PRODUCT_TYPES.VALUE_ADDED,
      displayOrder: 4,
      isActive: true,
    },
    {
      name: "Heritage Pashmina Wool",
      slug: "pashmina",
      description: "100% authentic Changthang Pashmina handspun on charkha and woven by local artisans.",
      image: "/images/hero.jpg",
      productType: PRODUCT_TYPES.PASHMINA,
      displayOrder: 5,
      isActive: true,
    },
    {
      name: "Farm Harvest Baskets",
      slug: "farm-baskets",
      description: "Curated weekly baskets of seasonal vegetables, greens, and culinary herbs.",
      image: "/images/hero.jpg",
      productType: PRODUCT_TYPES.BASKET,
      displayOrder: 6,
      isActive: true,
    },
  ];

  const categories: Record<string, any> = {};
  for (const catDef of categoryDefinitions) {
    const existing = await Category.findOne({ slug: catDef.slug });
    if (!existing) {
      const created = await Category.create(catDef);
      categories[created.slug] = created._id;
    } else {
      categories[existing.slug] = existing._id;
    }
  }

  // 5. Seed Farm Batches
  let batch = await FarmBatch.findOne({ batchCode: "BAT-2026-STK01" });
  if (!batch) {
    batch = await FarmBatch.create({
      batchCode: "BAT-2026-STK01",
      cropName: "Organic Ladakhi Spinach & Greens",
      farmLocation: "Stakna 2-Acre River Terraces",
      sowingDate: new Date("2026-08-01"),
      expectedHarvestDate: new Date("2026-09-20"),
      actualHarvestDate: new Date("2026-09-16"),
      expectedQuantity: 150,
      actualHarvestedQuantity: 140,
      availableQuantity: 80,
      soldQuantity: 55,
      wasteQuantity: 5,
      unit: "kg",
      status: FARM_BATCH_STATUSES.HARVESTING,
      notes: "Pure Indus glacial melt irrigation; 3,250m elevation organic soil.",
    });
  }

  // 6. Seed Core Products across Six Sections
  const productDefinitions = [
    // Section 1: Vegetables (LOCAL_PERISHABLE)
    {
      title: "Organic Ladakhi Spinach (Palak)",
      slug: "organic-ladakhi-spinach",
      category: categories["vegetables"],
      productType: PRODUCT_TYPES.VEGETABLE,
      fulfillmentType: FULFILLMENT_TYPES.LOCAL_PERISHABLE,
      description: "Crisp, sweet mountain spinach grown with compost and glacial melt in Stakna.",
      shortDescription: "Sweet, high-brix mountain spinach harvested daily at sunrise.",
      images: ["/images/dining.jpg"],
      unit: "500g",
      pricePerUnit: 65,
      compareAtPrice: 80,
      availableQuantity: 35,
      minOrderQuantity: 1,
      maxOrderQuantity: 10,
      isDailyAvailable: true,
      shippingEligibility: SHIPPING_ELIGIBILITY.LOCAL_DELIVERY_ONLY,
      status: PRODUCT_STATUS.PUBLISHED,
      featured: true,
    },
    {
      title: "Passive Solar Greenhouse Cherry Tomatoes",
      slug: "solar-greenhouse-cherry-tomatoes",
      category: categories["vegetables"],
      productType: PRODUCT_TYPES.VEGETABLE,
      fulfillmentType: FULFILLMENT_TYPES.LOCAL_PERISHABLE,
      description: "Vine-ripened organic sweet cherry tomatoes cultivated in our solar thermal greenhouse.",
      shortDescription: "Intensely sweet cherry tomatoes packed with mountain sunshine.",
      images: ["/images/dining.jpg"],
      unit: "250g",
      pricePerUnit: 85,
      compareAtPrice: 100,
      availableQuantity: 28,
      minOrderQuantity: 1,
      maxOrderQuantity: 6,
      isDailyAvailable: true,
      shippingEligibility: SHIPPING_ELIGIBILITY.LOCAL_DELIVERY_ONLY,
      status: PRODUCT_STATUS.PUBLISHED,
      featured: true,
    },

    // Section 2: Flowers (LOCAL_PERISHABLE)
    {
      title: "Morning Himalayan Harvest Bouquet",
      slug: "morning-himalayan-harvest-bouquet",
      category: categories["flowers"],
      productType: PRODUCT_TYPES.FLOWER,
      fulfillmentType: FULFILLMENT_TYPES.LOCAL_PERISHABLE,
      description: "Freshly cut gladioli, marigolds, cosmos, and lavender from our Stakna flower terraces.",
      shortDescription: "Hand-tied seasonal mountain bouquet cut fresh on delivery morning.",
      images: ["/images/suite-riverfront.jpg"],
      unit: "bouquet",
      pricePerUnit: 450,
      compareAtPrice: 550,
      availableQuantity: 15,
      minOrderQuantity: 1,
      maxOrderQuantity: 4,
      isDailyAvailable: true,
      shippingEligibility: SHIPPING_ELIGIBILITY.LOCAL_DELIVERY_ONLY,
      status: PRODUCT_STATUS.PUBLISHED,
      featured: true,
    },

    // Section 3: Saplings (LOCAL_PERISHABLE)
    {
      title: "Halman Apricot Sapling (2-Year Grafted)",
      slug: "halman-apricot-sapling",
      category: categories["saplings"],
      productType: PRODUCT_TYPES.SAPLING,
      fulfillmentType: FULFILLMENT_TYPES.LOCAL_PERISHABLE,
      description: "Famous sweet Halman apricot sapling ready for planting in high-altitude Ladakhi soil. High sugar content and heavy fruit yield.",
      shortDescription: "2-year grafted sweet Halman apricot rootstock.",
      images: ["/images/hero.jpg"],
      unit: "sapling",
      pricePerUnit: 350,
      compareAtPrice: 420,
      availableQuantity: 40,
      minOrderQuantity: 1,
      maxOrderQuantity: 10,
      isDailyAvailable: true,
      shippingEligibility: SHIPPING_ELIGIBILITY.LOCAL_DELIVERY_ONLY,
      status: PRODUCT_STATUS.PUBLISHED,
      featured: true,
      saplingDetails: {
        idealPlantingSeason: "March - April (Spring) or October (Autumn)",
        heightInCm: 90,
        sunRequirement: "Full Sun, South-Facing",
        nativeElevationMeters: 3250,
      },
    },
    {
      title: "Raktsey Karpo White Apricot Sapling",
      slug: "raktsey-karpo-apricot-sapling",
      category: categories["saplings"],
      productType: PRODUCT_TYPES.SAPLING,
      fulfillmentType: FULFILLMENT_TYPES.LOCAL_PERISHABLE,
      description: "Rare GI-tagged white-seeded sweet apricot endemic to Ladakh. Highly prized for juicy flesh and edible sweet kernel.",
      shortDescription: "GI-tagged Ladakhi white-seed apricot sapling.",
      images: ["/images/hero.jpg"],
      unit: "sapling",
      pricePerUnit: 450,
      compareAtPrice: 500,
      availableQuantity: 25,
      minOrderQuantity: 1,
      maxOrderQuantity: 5,
      isDailyAvailable: true,
      shippingEligibility: SHIPPING_ELIGIBILITY.LOCAL_DELIVERY_ONLY,
      status: PRODUCT_STATUS.PUBLISHED,
      featured: true,
      saplingDetails: {
        idealPlantingSeason: "Early Spring (March - April)",
        heightInCm: 85,
        sunRequirement: "Full Sun",
        nativeElevationMeters: 3250,
      },
    },

    // Section 4: Value-Added Products (SHIPPABLE)
    {
      title: "Wild Seabuckthorn & Raw Honey Preserve",
      slug: "wild-seabuckthorn-raw-honey-preserve",
      category: categories["value-added"],
      productType: PRODUCT_TYPES.VALUE_ADDED,
      fulfillmentType: FULFILLMENT_TYPES.SHIPPABLE,
      description: "Artisanal vitamin-C rich seabuckthorn berries hand-picked along the Indus riverbanks, blended with pure raw clover honey. Zero preservatives.",
      shortDescription: "Superfood preserve made from wild Indus seabuckthorn.",
      images: ["/images/dining.jpg"],
      unit: "jar",
      pricePerUnit: 380,
      compareAtPrice: 450,
      availableQuantity: 65,
      minOrderQuantity: 1,
      maxOrderQuantity: 12,
      isDailyAvailable: true,
      shippingEligibility: SHIPPING_ELIGIBILITY.PAN_INDIA_ELIGIBLE,
      status: PRODUCT_STATUS.PUBLISHED,
      featured: true,
    },
    {
      title: "Sun-Dried Halman Apricots (Organic)",
      slug: "sun-dried-halman-apricots",
      category: categories["value-added"],
      productType: PRODUCT_TYPES.VALUE_ADDED,
      fulfillmentType: FULFILLMENT_TYPES.SHIPPABLE,
      description: "Naturally sun-dried on clean mountain rooftops under pure Himalayan UV rays. Soft, chewy, and naturally sweet with zero sulfur.",
      shortDescription: "Sulfur-free organic sun-dried sweet apricots.",
      images: ["/images/hero.jpg"],
      unit: "500g",
      pricePerUnit: 420,
      compareAtPrice: 490,
      availableQuantity: 80,
      minOrderQuantity: 1,
      maxOrderQuantity: 10,
      isDailyAvailable: true,
      shippingEligibility: SHIPPING_ELIGIBILITY.PAN_INDIA_ELIGIBLE,
      status: PRODUCT_STATUS.PUBLISHED,
      featured: true,
    },

    // Section 5: Pashmina Wool (SHIPPABLE)
    {
      title: "Kharnak Handspun Natural Pashmina Stole",
      slug: "kharnak-handspun-pashmina-stole",
      category: categories["pashmina"],
      productType: PRODUCT_TYPES.PASHMINA,
      fulfillmentType: FULFILLMENT_TYPES.SHIPPABLE,
      description: "Crafted from pure Changra goat cashmere sourced from the high-altitude nomadic pastoralists of Kharnak (4,500m). Handspun on a traditional Ladakhi charkha (Yender) and handwoven in natural un-dyed cream tone.",
      shortDescription: "Authentic 100% Kharnak handspun nomadic cashmere stole.",
      images: ["/images/suite-riverfront.jpg"],
      unit: "stole",
      pricePerUnit: 14500,
      compareAtPrice: 16500,
      availableQuantity: 6,
      minOrderQuantity: 1,
      maxOrderQuantity: 2,
      isDailyAvailable: true,
      shippingEligibility: SHIPPING_ELIGIBILITY.PAN_INDIA_ELIGIBLE,
      status: PRODUCT_STATUS.PUBLISHED,
      featured: true,
      pashminaHeritage: {
        origin: "Kharnak & Rupshu, Changthang Plateau (4,500m – 5,000m)",
        craftsmanship: "Hand-combed during spring molt, hand-dehaired, handspun on traditional wooden charkha, and woven on four-pedal handlooms by Ladakhi master weavers.",
        careInstructions: "Dry clean only or gentle cold bath with natural wool soap. Never wring or twist. Store with cedar balls.",
        artisanNotes: "Spun by Diskit Lhamo and the Stakna Women's Artisan Collective.",
      },
    },
    {
      title: "Changthang Heritage Woven Pashmina Shawl (Charcoal)",
      slug: "changthang-heritage-woven-pashmina-shawl",
      category: categories["pashmina"],
      productType: PRODUCT_TYPES.PASHMINA,
      fulfillmentType: FULFILLMENT_TYPES.SHIPPABLE,
      description: "Generous 2m x 1m pure cashmere shawl woven with authentic diamond weave (Chashm-e-Bulbul). Unsurpassed warmth and featherlight drape.",
      shortDescription: "Heritage diamond-weave Changthang Pashmina shawl.",
      images: ["/images/hero.jpg"],
      unit: "shawl",
      pricePerUnit: 24500,
      compareAtPrice: 28000,
      availableQuantity: 4,
      minOrderQuantity: 1,
      maxOrderQuantity: 2,
      isDailyAvailable: true,
      shippingEligibility: SHIPPING_ELIGIBILITY.PAN_INDIA_ELIGIBLE,
      status: PRODUCT_STATUS.PUBLISHED,
      featured: true,
      pashminaHeritage: {
        origin: "Changthang Nomadic Pastoralist Cooperative",
        craftsmanship: "Master handwoven on traditional frame loom with natural walnut rind botanical dye.",
        careInstructions: "Dry clean only. Store wrapped in breathable muslin cloth.",
        artisanNotes: "14 microns microscopic fiber diameter certified authentic Changra cashmere.",
      },
    },
  ];

  for (const p of productDefinitions) {
    if (!p.category) continue;
    const exists = await Product.findOne({ slug: p.slug });
    if (!exists) {
      await Product.create(p as any);
      console.log(`Created product: ${p.title} (${p.fulfillmentType})`);
    } else {
      // Ensure fulfillmentType is updated
      if (!exists.fulfillmentType || exists.fulfillmentType !== p.fulfillmentType) {
        exists.fulfillmentType = p.fulfillmentType;
        if (p.pashminaHeritage) exists.pashminaHeritage = p.pashminaHeritage;
        if (p.saplingDetails) exists.saplingDetails = p.saplingDetails;
        await exists.save();
      }
    }
  }

  // 7. Seed Physical Farm Operations: Stock Items (Raw Materials)
  const stockCount = await StockItem.countDocuments();
  if (stockCount === 0) {
    await StockItem.insertMany([
      {
        name: "Organic High-Altitude Spinach Seeds (L-SP01)",
        category: "SEEDS",
        unit: "packet",
        quantityOnHand: 45,
        reorderThreshold: 10,
        supplier: "SKUAST Regional Agri Center, Leh",
        costPerUnit: 95,
        location: "Greenhouse Storage Cabinet #1",
        lastRestockedDate: new Date(),
      },
      {
        name: "Fermented Earthen Compost & Yak Manure",
        category: "MANURE_COMPOST",
        unit: "kg",
        quantityOnHand: 650,
        reorderThreshold: 150,
        supplier: "Stakna Pastoral Herders Collective",
        costPerUnit: 18,
        location: "South Compost Pit #2",
        lastRestockedDate: new Date(),
      },
      {
        name: "250ml Hexagonal Glass Jam Jars + Gold Lids",
        category: "PACKAGING_JARS_LABELS",
        unit: "piece",
        quantityOnHand: 280,
        reorderThreshold: 80,
        supplier: "Himalayan Sustainable Packaging",
        costPerUnit: 22,
        location: "Pantry Dry Store",
        lastRestockedDate: new Date(),
      },
      {
        name: "Raw Combed Changra Pashmina Fiber (Grade A)",
        category: "RAW_PASHMINA_WOOL",
        unit: "kg",
        quantityOnHand: 18.5,
        reorderThreshold: 5,
        supplier: "Kharnak Nomad Herders Cooperative",
        costPerUnit: 4800,
        location: "Wool Curing Loft",
        lastRestockedDate: new Date(),
      },
      {
        name: "UV-Resistant 200-Micron Greenhouse Poly Film",
        category: "GREENHOUSE_SHEETING",
        unit: "rolls",
        quantityOnHand: 3,
        reorderThreshold: 1,
        supplier: "Ladakh Solar Innovations",
        costPerUnit: 8200,
        location: "Farm Tool Barn",
        lastRestockedDate: new Date(),
      },
    ]);
    console.log("Seeded raw stock materials.");
  }

  // 8. Seed Staff Members
  const staffCount = await StaffMember.countDocuments();
  let staffList: any[] = [];
  if (staffCount === 0) {
    staffList = await StaffMember.insertMany([
      {
        name: "Tsering Angchok",
        role: "FARM_HAND",
        contact: "+91 94191 22334",
        wageType: "DAILY",
        wageRate: 850,
        startDate: new Date("2026-03-01"),
        active: true,
      },
      {
        name: "Stanzin Dolma",
        role: "GARDENER",
        contact: "+91 94191 44556",
        wageType: "DAILY",
        wageRate: 900,
        startDate: new Date("2026-04-15"),
        active: true,
      },
      {
        name: "Rigzin Norboo",
        role: "DELIVERY_STAFF",
        contact: "+91 94191 66778",
        wageType: "MONTHLY",
        wageRate: 22000,
        startDate: new Date("2026-05-01"),
        active: true,
      },
      {
        name: "Diskit Lhamo",
        role: "PASHMINA_ARTISAN",
        contact: "+91 94191 88990",
        wageType: "MONTHLY",
        wageRate: 25000,
        startDate: new Date("2026-02-01"),
        active: true,
      },
    ]);
    console.log("Seeded farm staff roster.");
  } else {
    staffList = await StaffMember.find();
  }

  // 9. Seed Attendance for today
  if (staffList.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingAtt = await Attendance.findOne({ date: { $gte: today } });
    if (!existingAtt) {
      await Attendance.insertMany([
        {
          staffMember: staffList[0]._id,
          date: new Date(),
          status: "PRESENT",
          wageCalculated: staffList[0].wageRate,
          notes: "Greenhouse watering and bed weeding",
        },
        {
          staffMember: staffList[1]._id,
          date: new Date(),
          status: "PRESENT",
          wageCalculated: staffList[1].wageRate,
          notes: "Flower garden cutting and trimming",
        },
        {
          staffMember: staffList[2]._id,
          date: new Date(),
          status: "PRESENT",
          wageCalculated: Math.round(staffList[2].wageRate / 30),
          notes: "Morning Leh delivery route run",
        },
      ]);
      console.log("Seeded daily attendance.");
    }
  }

  // 10. Seed Equipment Assets
  const equipCount = await EquipmentAsset.countDocuments();
  if (equipCount === 0) {
    await EquipmentAsset.insertMany([
      {
        name: "BCS 740 Power Tiller & Rotary Cultivator",
        type: "Tiller / Cultivator",
        serialNumber: "BCS-740-2025-089",
        purchaseDate: new Date("2025-04-10"),
        condition: "GOOD",
        lastMaintenanceDate: new Date("2026-08-15"),
        nextMaintenanceDueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        maintenanceCost: 1500,
      },
      {
        name: "3HP Solar DC Submersible Glacial Pump",
        type: "Solar Irrigation Pump",
        serialNumber: "SLR-PMP-3000-01",
        purchaseDate: new Date("2025-06-01"),
        condition: "EXCELLENT",
        lastMaintenanceDate: new Date("2026-09-01"),
        nextMaintenanceDueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Passive Solar Earth-Bermed Greenhouse #1",
        type: "Greenhouse Infrastructure",
        condition: "GOOD",
        lastMaintenanceDate: new Date("2026-07-20"),
        nextMaintenanceDueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Mahindra Bolero Camper 4x4 (Farm Delivery Van)",
        type: "Delivery Vehicle",
        serialNumber: "LA-02-B-4412",
        purchaseDate: new Date("2024-11-20"),
        condition: "NEEDS_MAINTENANCE",
        lastMaintenanceDate: new Date("2026-06-10"),
        nextMaintenanceDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        maintenanceCost: 4500,
      },
    ]);
    console.log("Seeded equipment assets.");
  }

  // 11. Seed Farm Tasks
  const taskCount = await Task.countDocuments();
  if (taskCount === 0 && staffList.length > 0) {
    await Task.insertMany([
      {
        title: "Irrigate winter spinach beds with solar drip line",
        description: "Verify solar pump battery level and flush lines before sunset.",
        category: "GREENHOUSE",
        assignedTo: staffList[0]._id,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "OPEN",
        priority: "HIGH",
      },
      {
        title: "Prune Raktsey Karpo & Halman apricot rootstocks",
        description: "Remove low suckers and inspect grafted unions on sapling terrace.",
        category: "FARM",
        assignedTo: staffList[1]._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "OPEN",
        priority: "MEDIUM",
      },
      {
        title: "Vehicle brake inspection & tire rotation for Bolero Camper",
        description: "Scheduled servicing before Indus Valley delivery route.",
        category: "MAINTENANCE",
        assignedTo: staffList[2]._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: "IN_PROGRESS",
        priority: "URGENT",
      },
      {
        title: "Hand-comb and sort raw Kharnak cashmere fleece batch #04",
        description: "Separate coarse guard hairs to achieve 14-micron yarn grade.",
        category: "PASHMINA",
        assignedTo: staffList[3]._id,
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: "OPEN",
        priority: "HIGH",
      },
    ]);
    console.log("Seeded assignable farm tasks.");
  }

  // 12. Seed Section-Linked Expenses
  const expenseCount = await ExpenseEntry.countDocuments();
  if (expenseCount === 0) {
    await ExpenseEntry.insertMany([
      {
        title: "Weekly Greenhouse Labor Wages",
        category: "LABOR",
        amount: 5100,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        linkedSection: "VEGETABLES",
        paidTo: "Stakna Farm Hands",
      },
      {
        title: "Certified Halman Apricot Rootstock Lot Purchase",
        category: "MATERIALS",
        amount: 8500,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        linkedSection: "SAPLINGS",
        paidTo: "SKUAST Regional Nursery",
      },
      {
        title: "Raw Nomadic Cashmere Fiber Procurement from Kharnak",
        category: "MATERIALS",
        amount: 48000,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        linkedSection: "PASHMINA",
        paidTo: "Kharnak Nomad Herders Cooperative",
      },
      {
        title: "Glass Jar & Tamper-Evident Lid Consignment",
        category: "MATERIALS",
        amount: 4400,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        linkedSection: "VALUE_ADDED",
        paidTo: "Packaging Vendors",
      },
      {
        title: "Diesel Fuel for Morning Leh Harvest Deliveries",
        category: "TRANSPORT",
        amount: 2800,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        linkedSection: "VEGETABLES",
        paidTo: "Indian Oil Leh",
      },
    ]);
    console.log("Seeded section-linked expense entries.");
  }

  // 13. Seed Content Blocks for Story Pages
  const farmStory = await ContentBlock.findOne({ key: "farm-story" });
  if (!farmStory) {
    await ContentBlock.create({
      key: "farm-story",
      title: "The Story of Stakna Farmhouse: High-Altitude Regenerative Agriculture",
      section: "story",
      content: `
# High-Altitude Regenerative Agriculture in Stakna, Ladakh

Nestled at an elevation of **3,250 meters (10,660 feet)** along the crystal-clear glacial waters of the sacred Indus River, **Stakna Farmhouse** is a **2-acre regenerative farm and eco-living plot** in its early land-development stage.

### The Land & The Mountain Rhythms
Surrounded by the dramatic granite crags of the Ladakh Range and facing the historic 16th-century Stakna Monastery ("Tiger's Nose"), our land sits on sun-drenched river terraces. With over **300 days of intense high-altitude sunlight** per year, our crops receive exceptional UV radiation, producing naturally sweet vegetables with higher brix content and deep, vibrant pigmentation.

### Glacial Waters & Natural Fertility
In a cold arid desert receiving less than 100mm of annual rainfall, water is life. Our fields are nourished directly by glacial meltwater channeled through ancient stone aqueducts from the snowfields above. We employ **strict zero-chemical farming practices**:
- Fermented cow manure from indigenous Ladakhi cattle
- Composted leaf mould and clover green manure
- Living soil micro-biology that protects root systems against frost

### Passive Solar Thermal Greenhouses
Ladakh's winters often see temperatures plummet to **-20°C**. Instead of burning fossil fuels, we utilize **passive solar earth-bermed greenhouses**. Designed with 18-inch rammed-earth south-facing thermal mass walls, these structures trap solar radiation during the day and radiate gentle warmth through sub-zero nights, allowing us to harvest crisp mountain spinach, coriander, and salad greens throughout midwinter.
      `,
      metadata: {
        elevation: "3,250m",
        acreage: "2 Acres",
        location: "Stakna, Indus Valley, Leh",
        landStage: "Early Land-Development Stage",
      },
    });
    console.log("Seeded Farm Story content.");
  }

  const pashminaStory = await ContentBlock.findOne({ key: "pashmina-heritage" });
  if (!pashminaStory) {
    await ContentBlock.create({
      key: "pashmina-heritage",
      title: "Sacred Changthang Fleece: The True Heritage of Ladakhi Pashmina",
      section: "story",
      content: `
# Kharnak to Stakna: The Heritage of Genuine Himalayan Cashmere

High above the clouds on the **windswept Changthang plateau (4,500m to 5,200m)**, the semi-nomadic Changpa pastoralists live in intimate harmony with their **Changra goats (Capra hircus laniger)**.

### The World's Finest Natural Fiber
To survive biting winter gales that drop below **-40°C**, the Changra goat grows a microscopically fine undercoat beneath its shaggy outer hair. Averaging just **12 to 15 microns in diameter**—roughly one-sixth the width of a human hair—this fiber is true Pashmina, renowned across millennia as "soft gold."

### Hand-Combed & Ethical Sourcing
In spring, as temperatures rise, the fleece naturally sheds. Nomads gently comb out the fleece with wire combs without harming the animals. We source raw cashmere lots directly from the **Kharnak Nomadic Herders Cooperative**, guaranteeing fair trade and transparent pasture-to-loom provenance.

### The Sacred Art of the Charkha (Yender)
Machine spinning destroys the microscopic scales of delicate Pashmina fiber, turning it brittle. At Stakna Farmhouse, our artisans preserve the ancient art of hand-spinning:
1. **Hand-Dehairing**: Removing coarse guard hairs by hand to preserve fiber integrity.
2. **Yender Spinning**: Traditional wooden drop-spindle and charkha spinning, yielding a cloud-like yarn with unmatched softness.
3. **Heritage Frame Weaving**: Woven on traditional four-pedal handlooms by master weavers in Stakna.
      `,
      metadata: {
        origin: "Kharnak & Rupshu, Changthang Plateau",
        fiberMicrons: "12 - 14.5 Microns",
        craftsmanship: "100% Handspun on Charkha & Handwoven",
      },
    });
    console.log("Seeded Pashmina Heritage content.");
  }

  console.log("Stakna Farmhouse seeding process completed successfully!");
}
