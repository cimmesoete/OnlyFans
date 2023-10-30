// swiftlint:disable all
import Amplify
import Foundation

extension User {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case name
    case handle
    case bio
    case avatar
    case coverImage
    case subscriptionPrice
    case Posts
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let user = User.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "Users"
    model.syncPluralName = "Users"
    
    model.attributes(
      .primaryKey(fields: [user.id])
    )
    
    model.fields(
      .field(user.id, is: .required, ofType: .string),
      .field(user.name, is: .required, ofType: .string),
      .field(user.handle, is: .required, ofType: .string),
      .field(user.bio, is: .optional, ofType: .string),
      .field(user.avatar, is: .optional, ofType: .string),
      .field(user.coverImage, is: .optional, ofType: .string),
      .field(user.subscriptionPrice, is: .required, ofType: .double),
      .hasMany(user.Posts, is: .optional, ofType: Post.self, associatedWith: Post.keys.user2ID),
      .field(user.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(user.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension User: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}