import { Router } from "express";
import { createApiErrorResponse, generatePaginationMetadata, getPaginationParams, getSortingDirection } from "@/utils/apiHelpers";
import { db } from "@/db/db";
import { AnyColumn } from "drizzle-orm";
import { tools } from "@/db/schema";
import { ApiMetadata, ApiResponse } from "@/type";

/* Routes */
export const ToolsRouter = Router();
/**
 * Tools API Endpoints 🛠️
 * Comprehensive set of routes for tool management and discovery
 */

// Basic CRUD Operations 📋
// GET Endpoints
// - Retrieve Tools
//   ✅ Get all tools
//    Get tool by specific ID
//    Filter tools by category
//    Filter tools by platform
//    Combined category and platform filtering
//    Retrieve tools from user's collection
//    Fetch deleted tools from user's tool bin
//    List banned tools

// Modification Endpoints 🔧
// - Tool Management
//   ✅ Create new tool
//   ✅ Update existing tool
//   ✅ Delete tool
//   ✅ Ban tool
//   ✅ Unban tool

/**
 * Phase 2 Enhancements 🚀
 * Advanced Discovery Features
 */
// Discovery Endpoints
//   🔥 Top tools ranking
//   📈 Trending tools
//   🆕 Newest tools
//   👍 Most liked tools
//   💬 Most commented tools
//   👀 Most viewed tools

/*
 * Development Roadmap 🗺️
 * TODO: Migrate controllers and helpers to dedicated folders after success
 */



// Get all tools

ToolsRouter.get( '/', async ( req, res ) => {
  try {
    // common things
    const { sortBy, order, page, limit, offset } = getPaginationParams( req.query, [ 'createdAt', 'name' ] );
    const orderBy = getSortingDirection( order );

    const tools = await getAllToolsPromise( sortBy, order, page, limit, offset );

    console.log( "Fetched all Tools: ", tools );


    const metadata = generatePaginationMetadata( tools.length, page, limit, sortBy, order );

    const resposne: ApiResponse<typeof tools[ number ]> = {
      success: true,
      message: "All Tools fetched successfully",
      data: tools,
      metadata: metadata as ApiMetadata,
    };

    res.status( 200 ).json( resposne );
  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );


// Helper Functions
const getAllToolsPromise = async ( sortingField: string, order: string, page: number, limit: number, offset: number, categoryId?: string, platformId?: string ) => {
  const orderBy = getSortingDirection( order );
  // TODO : Add category and platform filtering
  return db.select().from( tools ).orderBy( orderBy( tools[ sortingField as keyof typeof tools ] as AnyColumn ) ).limit( limit ).offset( offset );
};
