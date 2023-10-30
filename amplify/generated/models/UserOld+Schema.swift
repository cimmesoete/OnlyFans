// swiftlint:disable all
import Amplify
import Foundation

extension UserOld {
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
    let userOld = UserOld.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "UserOlds"
    model.syncPluralName = "UserOlds"
    
    model.attributes(
      .primaryKey(fields: [userOld.id])
    )
    
    model.fields(
      .field(userOld.id, is: .required, ofType: .string),
      .field(userOld.name, is: .required, ofType: .string),
      .field(userOld.handle, is: .required, ofType: .string),
      .field(userOld.bio, is: .optional, ofType: .string),
      .field(userOld.avatar, is: .optional, ofType: .string),
      .field(userOld.coverImage, is: .optional, ofType: .string),
      .field(userOld.subscriptionPrice, is: .required, ofType: .double),
      .hasMany(userOld.Posts, is: .optional, ofType: Post.self, associatedWith: Post.keys.userID),
      .field(userOld.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(userOld.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension UserOld: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}