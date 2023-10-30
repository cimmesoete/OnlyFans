// swiftlint:disable all
import Amplify
import Foundation

public struct UserOld: Model {
  public let id: String
  public var name: String
  public var handle: String
  public var bio: String?
  public var avatar: String?
  public var coverImage: String?
  public var subscriptionPrice: Double
  public var Posts: List<Post>?
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      name: String,
      handle: String,
      bio: String? = nil,
      avatar: String? = nil,
      coverImage: String? = nil,
      subscriptionPrice: Double,
      Posts: List<Post>? = []) {
    self.init(id: id,
      name: name,
      handle: handle,
      bio: bio,
      avatar: avatar,
      coverImage: coverImage,
      subscriptionPrice: subscriptionPrice,
      Posts: Posts,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      name: String,
      handle: String,
      bio: String? = nil,
      avatar: String? = nil,
      coverImage: String? = nil,
      subscriptionPrice: Double,
      Posts: List<Post>? = [],
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.name = name
      self.handle = handle
      self.bio = bio
      self.avatar = avatar
      self.coverImage = coverImage
      self.subscriptionPrice = subscriptionPrice
      self.Posts = Posts
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}