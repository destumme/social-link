import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { UserModel } from '@/generated/prisma/models/User';
import { TraitModel } from '@/generated/prisma/models/Trait';
import { ConnectionModel } from '@/generated/prisma/models/Connection';
import { ConnectionSideModel } from '@/generated/prisma/models/ConnectionSide';
import { ConnectionGroupModel } from '@/generated/prisma/models/ConnectionGroup';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date | string; output: Date | string; }
};

export type Connection = {
  __typename?: 'Connection';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  initiator: User;
  recipient: User;
  sides: Array<ConnectionSide>;
  status: ConnectionStatus;
};

export type ConnectionGroup = {
  __typename?: 'ConnectionGroup';
  account: User;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sides: Array<ConnectionSide>;
  traits: Array<Trait>;
};

export type ConnectionSide = {
  __typename?: 'ConnectionSide';
  account: User;
  groups: Array<ConnectionGroup>;
  id: Scalars['ID']['output'];
};

export enum ConnectionStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

export type CreateConnectionGroupInput = {
  name: Scalars['String']['input'];
  traitIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type CreateTraitInput = {
  category: TraitCategory;
  icon?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptConnection: Connection;
  addConnectionToGroup: ConnectionSide;
  addTraitToGroup: ConnectionGroup;
  createConnectionGroup: ConnectionGroup;
  createTrait: Trait;
  declineConnection: Scalars['Boolean']['output'];
  deleteConnectionGroup: Scalars['Boolean']['output'];
  deleteTrait: Scalars['Boolean']['output'];
  removeConnection: Scalars['Boolean']['output'];
  removeConnectionFromGroup: ConnectionSide;
  removeTraitFromGroup: ConnectionGroup;
  requestConnection: Connection;
  updateConnectionGroup: ConnectionGroup;
  updateConnectionGroups: ConnectionSide;
  updateConnectionTraits: Connection;
  updateTrait: Trait;
  updateUser: User;
};


export type MutationAcceptConnectionArgs = {
  connectionId: Scalars['ID']['input'];
};


export type MutationAddConnectionToGroupArgs = {
  connectionId: Scalars['ID']['input'];
  groupId: Scalars['ID']['input'];
};


export type MutationAddTraitToGroupArgs = {
  groupId: Scalars['ID']['input'];
  traitId: Scalars['ID']['input'];
};


export type MutationCreateConnectionGroupArgs = {
  input: CreateConnectionGroupInput;
};


export type MutationCreateTraitArgs = {
  input: CreateTraitInput;
};


export type MutationDeclineConnectionArgs = {
  connectionId: Scalars['ID']['input'];
};


export type MutationDeleteConnectionGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTraitArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveConnectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveConnectionFromGroupArgs = {
  connectionId: Scalars['ID']['input'];
  groupId: Scalars['ID']['input'];
};


export type MutationRemoveTraitFromGroupArgs = {
  groupId: Scalars['ID']['input'];
  traitId: Scalars['ID']['input'];
};


export type MutationRequestConnectionArgs = {
  accountId: Scalars['ID']['input'];
  input: RequestConnectionInput;
};


export type MutationUpdateConnectionGroupArgs = {
  id: Scalars['ID']['input'];
  input: UpdateConnectionGroupInput;
};


export type MutationUpdateConnectionGroupsArgs = {
  connectionId: Scalars['ID']['input'];
  groupIds: Array<Scalars['ID']['input']>;
};


export type MutationUpdateConnectionTraitsArgs = {
  connectionId: Scalars['ID']['input'];
  traitIds: Array<Scalars['ID']['input']>;
};


export type MutationUpdateTraitArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTraitInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  connectionByAccount?: Maybe<Connection>;
  me?: Maybe<User>;
  myConnectionGroups: Array<ConnectionGroup>;
  myConnections: Array<Connection>;
  myTraits: Array<Trait>;
  pendingConnections: Array<Connection>;
  searchUsers: Array<User>;
  traitById?: Maybe<Trait>;
  userByShareId?: Maybe<User>;
  userByUsername?: Maybe<User>;
};


export type QueryConnectionByAccountArgs = {
  accountId: Scalars['ID']['input'];
};


export type QuerySearchUsersArgs = {
  query: Scalars['String']['input'];
};


export type QueryTraitByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserByShareIdArgs = {
  shareId: Scalars['String']['input'];
};


export type QueryUserByUsernameArgs = {
  username: Scalars['String']['input'];
};

export type RequestConnectionInput = {
  groupIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  sharedTraitIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type Trait = {
  __typename?: 'Trait';
  account: User;
  category?: Maybe<TraitCategory>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isVisible: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
  visibleGroups: Array<ConnectionGroup>;
};

export enum TraitCategory {
  ContactInfo = 'CONTACT_INFO',
  MailingAddress = 'MAILING_ADDRESS',
  MessagingHandle = 'MESSAGING_HANDLE',
  Other = 'OTHER',
  ProfessionalLink = 'PROFESSIONAL_LINK',
  SocialLink = 'SOCIAL_LINK',
  WebsiteLink = 'WEBSITE_LINK'
}

export type UpdateConnectionGroupInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  traitIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateTraitInput = {
  category?: InputMaybe<TraitCategory>;
  icon?: InputMaybe<Scalars['String']['input']>;
  isVisible?: InputMaybe<Scalars['Boolean']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  publicListed?: InputMaybe<Scalars['Boolean']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  connectionGroups: Array<ConnectionGroup>;
  connections: Array<Connection>;
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  publicListed: Scalars['Boolean']['output'];
  traits: Array<Trait>;
  username: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Connection: ResolverTypeWrapper<ConnectionModel>;
  ConnectionGroup: ResolverTypeWrapper<ConnectionGroupModel>;
  ConnectionSide: ResolverTypeWrapper<ConnectionSideModel>;
  ConnectionStatus: ConnectionStatus;
  CreateConnectionGroupInput: CreateConnectionGroupInput;
  CreateTraitInput: CreateTraitInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RequestConnectionInput: RequestConnectionInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Trait: ResolverTypeWrapper<TraitModel>;
  TraitCategory: TraitCategory;
  UpdateConnectionGroupInput: UpdateConnectionGroupInput;
  UpdateTraitInput: UpdateTraitInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<UserModel>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Connection: ConnectionModel;
  ConnectionGroup: ConnectionGroupModel;
  ConnectionSide: ConnectionSideModel;
  CreateConnectionGroupInput: CreateConnectionGroupInput;
  CreateTraitInput: CreateTraitInput;
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  RequestConnectionInput: RequestConnectionInput;
  String: Scalars['String']['output'];
  Trait: TraitModel;
  UpdateConnectionGroupInput: UpdateConnectionGroupInput;
  UpdateTraitInput: UpdateTraitInput;
  UpdateUserInput: UpdateUserInput;
  User: UserModel;
};

export type ConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Connection'] = ResolversParentTypes['Connection']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  initiator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  sides?: Resolver<Array<ResolversTypes['ConnectionSide']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ConnectionStatus'], ParentType, ContextType>;
};

export type ConnectionGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConnectionGroup'] = ResolversParentTypes['ConnectionGroup']> = {
  account?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sides?: Resolver<Array<ResolversTypes['ConnectionSide']>, ParentType, ContextType>;
  traits?: Resolver<Array<ResolversTypes['Trait']>, ParentType, ContextType>;
};

export type ConnectionSideResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConnectionSide'] = ResolversParentTypes['ConnectionSide']> = {
  account?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  groups?: Resolver<Array<ResolversTypes['ConnectionGroup']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptConnection?: Resolver<ResolversTypes['Connection'], ParentType, ContextType, RequireFields<MutationAcceptConnectionArgs, 'connectionId'>>;
  addConnectionToGroup?: Resolver<ResolversTypes['ConnectionSide'], ParentType, ContextType, RequireFields<MutationAddConnectionToGroupArgs, 'connectionId' | 'groupId'>>;
  addTraitToGroup?: Resolver<ResolversTypes['ConnectionGroup'], ParentType, ContextType, RequireFields<MutationAddTraitToGroupArgs, 'groupId' | 'traitId'>>;
  createConnectionGroup?: Resolver<ResolversTypes['ConnectionGroup'], ParentType, ContextType, RequireFields<MutationCreateConnectionGroupArgs, 'input'>>;
  createTrait?: Resolver<ResolversTypes['Trait'], ParentType, ContextType, RequireFields<MutationCreateTraitArgs, 'input'>>;
  declineConnection?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeclineConnectionArgs, 'connectionId'>>;
  deleteConnectionGroup?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteConnectionGroupArgs, 'id'>>;
  deleteTrait?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTraitArgs, 'id'>>;
  removeConnection?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveConnectionArgs, 'id'>>;
  removeConnectionFromGroup?: Resolver<ResolversTypes['ConnectionSide'], ParentType, ContextType, RequireFields<MutationRemoveConnectionFromGroupArgs, 'connectionId' | 'groupId'>>;
  removeTraitFromGroup?: Resolver<ResolversTypes['ConnectionGroup'], ParentType, ContextType, RequireFields<MutationRemoveTraitFromGroupArgs, 'groupId' | 'traitId'>>;
  requestConnection?: Resolver<ResolversTypes['Connection'], ParentType, ContextType, RequireFields<MutationRequestConnectionArgs, 'accountId' | 'input'>>;
  updateConnectionGroup?: Resolver<ResolversTypes['ConnectionGroup'], ParentType, ContextType, RequireFields<MutationUpdateConnectionGroupArgs, 'id' | 'input'>>;
  updateConnectionGroups?: Resolver<ResolversTypes['ConnectionSide'], ParentType, ContextType, RequireFields<MutationUpdateConnectionGroupsArgs, 'connectionId' | 'groupIds'>>;
  updateConnectionTraits?: Resolver<ResolversTypes['Connection'], ParentType, ContextType, RequireFields<MutationUpdateConnectionTraitsArgs, 'connectionId' | 'traitIds'>>;
  updateTrait?: Resolver<ResolversTypes['Trait'], ParentType, ContextType, RequireFields<MutationUpdateTraitArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  connectionByAccount?: Resolver<Maybe<ResolversTypes['Connection']>, ParentType, ContextType, RequireFields<QueryConnectionByAccountArgs, 'accountId'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  myConnectionGroups?: Resolver<Array<ResolversTypes['ConnectionGroup']>, ParentType, ContextType>;
  myConnections?: Resolver<Array<ResolversTypes['Connection']>, ParentType, ContextType>;
  myTraits?: Resolver<Array<ResolversTypes['Trait']>, ParentType, ContextType>;
  pendingConnections?: Resolver<Array<ResolversTypes['Connection']>, ParentType, ContextType>;
  searchUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QuerySearchUsersArgs, 'query'>>;
  traitById?: Resolver<Maybe<ResolversTypes['Trait']>, ParentType, ContextType, RequireFields<QueryTraitByIdArgs, 'id'>>;
  userByShareId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByShareIdArgs, 'shareId'>>;
  userByUsername?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByUsernameArgs, 'username'>>;
};

export type TraitResolvers<ContextType = any, ParentType extends ResolversParentTypes['Trait'] = ResolversParentTypes['Trait']> = {
  account?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['TraitCategory']>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isVisible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  visibleGroups?: Resolver<Array<ResolversTypes['ConnectionGroup']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  connectionGroups?: Resolver<Array<ResolversTypes['ConnectionGroup']>, ParentType, ContextType>;
  connections?: Resolver<Array<ResolversTypes['Connection']>, ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  publicListed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  traits?: Resolver<Array<ResolversTypes['Trait']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Connection?: ConnectionResolvers<ContextType>;
  ConnectionGroup?: ConnectionGroupResolvers<ContextType>;
  ConnectionSide?: ConnectionSideResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Trait?: TraitResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

