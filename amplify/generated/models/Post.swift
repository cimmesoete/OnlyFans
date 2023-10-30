// swiftlint:disable all
import Amplify
import Foundation

public struct Post: Model {
  public let id: String
  public var text: String?
  public var image: String?
  public var likes: Int
  public var userID: String
  public var user2ID: String
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      text: String? = nil,
      image: String? = nil,
      likes: Int,
      userID: String,
      user2ID: String) {
    self.init(id: id,
      text: text,
      image: image,
      likes: likes,
      userID: userID,
      user2ID: user2ID,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      text: String? = nil,
      image: String? = nil,
      likes: Int,
      userID: String,
      user2ID: String,
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.text = text
      self.image = image
      self.likes = likes
      self.userID = userID
      self.user2ID = user2ID
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}